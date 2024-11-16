from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework.authentication import TokenAuthentication
from .serializers import UserSerializer
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.apps import apps
import json
import logging
from sentence_transformers import SentenceTransformer, util
from chat.web3_interface import getUserBalance,getDonationProjects,get_total_carbon_emission
from langchain_community.embeddings.huggingface import HuggingFaceEmbeddings

embedding_model_name = 'sentence-transformers/all-mpnet-base-v2'
embedding_model = HuggingFaceEmbeddings(model_name=embedding_model_name)
similarity_threshold = 0.3
# Define function comments for similarity check
def get_function_comments():
    return {
        "calculate_exchange_rate": "Converts a given amount from one currency to another using the current exchange rate.",
        "getUserBalance":"Get the balance of the given wallet address",
        "getDonationProjects":"Get the lists of donation projects",
        "get_total_carbon_emission":"Get the user total carbon emission"
    }

class ChatModel(APIView):
    def post(self, request):
        input_request=request.body
        request_dict=json.loads(input_request)
        question = request_dict["Question"]
        # First, check if the question is similar to any function comment
        function_result = check_similarity_with_function_comment(question)
        
        if function_result:
            context = function_result  # Return the result from the function if similarity threshold is met
        else:
            context = apps.get_app_config('chat').rag_ins.perform_retrieval(question)
            # Proceed with normal RAG if no function is called
        result = apps.get_app_config('chat').rag_ins.generate_text(question,context)
        print("Original result is ",result)
        response_dict = {"Answer":result}
        return Response(response_dict)


def check_similarity_with_function_comment(query):
    function_comments = get_function_comments()
    
    for func_name, comment in function_comments.items():
        # Encode both comment and query to compare
        comment_embedding = embedding_model.embed_query(comment)
        query_embedding = embedding_model.embed_query(query)
        
        similarity_score = util.cos_sim(comment_embedding, query_embedding).item()
        print("similarity score is ", similarity_score)
        if similarity_score >= similarity_threshold:
            if func_name == "getUserBalance":
                return getUserBalance()
            if func_name == "getDonationProjects":
                return getDonationProjects()
            if func_name =="get_total_carbon_emission":
                return get_total_carbon_emission()
    print("Return nothing")
    return None  # No function invoked if similarity is below threshold