from transformers import (
  AutoTokenizer, 
  AutoModelForCausalLM, 
  BitsAndBytesConfig,
  pipeline
)
import torch
import json
import transformers

from transformers import BitsAndBytesConfig
from huggingface_hub import login
from langchain.text_splitter import CharacterTextSplitter
from langchain_community.document_loaders import TextLoader

from langchain_community.embeddings.huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFacePipeline
from langchain.docstore.document import Document
import os
from django.apps import apps
from dotenv import load_dotenv

load_dotenv() 

class RAG():
    def __init__(self):
        token = os.getenv("HG_KEY")
        login(token=token)

    def myLoader(self):
        # Load JSON data
        with open('chat/ecofly.json', 'r', encoding='utf-8') as file:
            data = json.load(file)

        # Process documents
        documents = []
        for item in data:
            title = item['Title']
            for doc in item['documents']:
                question = doc['question']
                answer = doc['answer']
                documents.append(Document(page_content=f"Question: {question}\nAnswer: {answer}", metadata={"title": title}))

        return documents
    
    def get_retriever(self):
        # Load Document and Split chunks
        print("Current dir is ",os.getcwd())
    
        documents = self.myLoader()
        
        # Convert documents into a format suitable for FAISS
        text_splitter = CharacterTextSplitter(chunk_size=300, chunk_overlap=50)
        split_docs = []
        for doc in documents:
            chunks = text_splitter.split_text(doc.page_content)
            for chunk in chunks:
                split_docs.append(Document(page_content=chunk, metadata=doc.metadata))


        # Load chunked documents into the FAISS index
        embedding_model_name = 'sentence-transformers/all-mpnet-base-v2'
        embeddings = HuggingFaceEmbeddings(model_name=embedding_model_name)
        db = FAISS.from_documents(split_docs, embeddings)
        print("DB index", db.index.ntotal)
        print("Vector Storing Done")
        retriever = db.as_retriever()
        return retriever
    
    def perform_retrieval(self, query):
        print("Retrieving ......")
        retriever = apps.get_app_config('chat').retriever
        results = retriever.invoke(query)
        contexts = []
        for i, result in enumerate(results):
            parts = result.page_content.split("Answer:")
            if len(parts) > 1:
                answer = parts[1].strip()
            else:
                answer = result.page_content.strip()
            contexts.append(answer)
        refix_contexts = " ".join(contexts)
        print("Retrieving Done.....")
        return refix_contexts

    
    def get_model(self):
        model_name = 'unsloth/llama-2-7b-chat-bnb-4bit'
    
        use_4bit = True

        # Compute dtype for 4-bit base models
        bnb_4bit_compute_dtype = "float16"

        # Quantization type (fp4 or nf4)
        bnb_4bit_quant_type = "nf4"

        # Activate nested quantization for 4-bit base models (double quantization)
        use_nested_quant = False

        compute_dtype = getattr(torch, bnb_4bit_compute_dtype)

        bnb_config = BitsAndBytesConfig(
            load_in_4bit=use_4bit,
            bnb_4bit_quant_type=bnb_4bit_quant_type,
            bnb_4bit_compute_dtype=compute_dtype,
            bnb_4bit_use_double_quant=use_nested_quant,
        )

        model = AutoModelForCausalLM.from_pretrained(model_name,quantization_config=bnb_config)
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        return model, tokenizer
    

    def generate_text(self, question, context):
        print("Generating .......")
        prompt_template = ("Using the provided context from the retrieved data, generate a concise answer to the question in the style of a Q&A bot for our Ecofly product.\n"
                       f"Context: {context}\n"
                       f"Question: {question}\n"
                       "Answer:")
        
        model = apps.get_app_config('chat').model
        tokenizer = apps.get_app_config('chat').tokenizer
        
        inputs = tokenizer(prompt_template, return_tensors="pt")
    
        # Generate the output using the model
        output = model.generate(**inputs, max_length=1000, num_return_sequences=1)
        
        # Decode the generated text
        generated_text = tokenizer.decode(output[0], skip_special_tokens=True)
        # Extract and return the generated answer (everything after 'Answer:')
        answer = generated_text.split("Answer:")[1].strip()
        if "\nQuestion" in answer:
            answer = answer.split("\nQuestion")[0]
        return answer
        
        
        
