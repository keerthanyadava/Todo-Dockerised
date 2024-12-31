from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import json, logging, os
from pymongo import MongoClient
from bson import json_util, ObjectId
from datetime import datetime

logger = logging.getLogger(__name__)

mongo_uri = 'mongodb://' + os.environ["MONGO_HOST"] + ':' + os.environ["MONGO_PORT"]
db = MongoClient(mongo_uri)['test_db']

class TodoListView(APIView):
    def get(self, request):
        try:
            todos = list(db.todos.find())
            return Response(json.loads(json_util.dumps(todos)), status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error fetching todos: {str(e)}")
            return Response(
                {"error": "Failed to fetch todos"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
    def post(self, request):
        try:
            if not request.data.get('description'):
                return Response(
                    {"error": "Description is required"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            todo = {
                'description': request.data['description'],
                'completed': False,
                'created_at': datetime.utcnow()
            }
            
            result = db.todos.insert_one(todo)
            todo['_id'] = str(result.inserted_id)
            return Response(todo, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Error creating todo: {str(e)}")
            return Response(
                {"error": "Failed to create todo"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def patch(self, request, id):
        try:
            result = db.todos.update_one(
                {'_id': ObjectId(id)},
                {'$set': request.data}
            )
            if result.modified_count == 0:
                return Response(
                    {"error": "Todo not found"}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error updating todo: {str(e)}")
            return Response(
                {"error": "Failed to update todo"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def delete(self, request, id):
        try:
            result = db.todos.delete_one({'_id': ObjectId(id)})
            if result.deleted_count == 0:
                return Response(
                    {"error": "Todo not found"}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            logger.error(f"Error deleting todo: {str(e)}")
            return Response(
                {"error": "Failed to delete todo"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )