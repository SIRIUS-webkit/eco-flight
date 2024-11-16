from django.apps import AppConfig
from transformers import (
  AutoTokenizer, 
  AutoModelForCausalLM, 
  BitsAndBytesConfig,
  pipeline
)
import torch

from transformers import BitsAndBytesConfig
from huggingface_hub import login
from langchain.prompts import PromptTemplate
from langchain.schema.runnable import RunnablePassthrough
from langchain.chains import LLMChain
from chat.rag import RAG
from langchain.chains import RetrievalQA
from langchain_core.output_parsers import JsonOutputParser

class ChatConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'chat'

    def ready(self):
        ChatConfig.rag_ins = RAG() 
        ChatConfig.retriever = ChatConfig.rag_ins.get_retriever()
        print("Done for creating retriever")
        ChatConfig.model, ChatConfig.tokenizer = ChatConfig.rag_ins.get_model()
        print("Done for creating model and tokenizer")
        print("Creating All Done")

