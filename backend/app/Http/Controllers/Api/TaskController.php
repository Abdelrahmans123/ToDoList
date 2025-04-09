<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    /**
----------------------------------------------------------------
     * @desc Get all tasks
     * @route GET /api/tasks
     * @access Private (Authenticated users and users that created the task)
     * 
----------------------------------------------------------------
     */
    public function index()
    {
        $tasks = Auth::user()->tasks()->whereNull('deleted_at')->with(['category', 'user'])->paginate(5);


        if ($tasks->isEmpty()) {
            return response()->json([
                'status' => 'success',
                'data' => ['message' => 'No tasks found.']
            ], 200);
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'tasks' => TaskResource::collection($tasks),
                'meta' => [
                    'current_page' => $tasks->currentPage(),
                    'last_page' => $tasks->lastPage(),
                    'per_page' => $tasks->perPage(),
                    'total' => $tasks->total(),
                ]
            ]
        ], 200);
    }
    public function show(string $id)
    {
        $task = Task::findOrFail($id);
        if (!$task) {
            return response()->json([
                'status' => 'fail',
                'data' => ['message' => 'Task not found.']
            ], 404);
        }
        return response()->json([
            'status' => 'success',
            'data' => [
                'task' =>  TaskResource::collection($task)
            ]
        ], 200);
    }
    /**
----------------------------------------------------------------
     * @desc Create a new task.
     * @route POST /api/tasks
     * @access Private (Authenticated users only)
----------------------------------------------------------------
     */
    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'category_id' => 'required|exists:categories,id',
                'user_id' => 'required|exists:users,id',
                'due_date' => 'required|date|after:today',
            ]);

            $task = Auth::user()->tasks()->create($validatedData);
            $task->load('category', 'user');

            return response()->json([
                'status' => 'success',
                'data' => [
                    'task' => new TaskResource($task)
                ]
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create task: ' . $e->getMessage()
            ], 500);
        }
    }
    /**
----------------------------------------------------------------
     * @desc Update an existing task.
     * @route PUT /api/tasks/{id}
     * @access Private (Authenticated users only)
----------------------------------------------------------------
     */
    public function update(Request $request, string $id)
    {
        try {
            $request->merge([
                'status' => $request->input('status', 'pending'),
            ]);
            $validatedData = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'category_id' => 'required|exists:categories,id',
                'user_id' => 'required|exists:users,id',
                'due_date' => 'required|date|after:today',
                'status' => 'in:pending,completed',
            ]);

            $task = Task::findOrFail($id);

            if ($task->user_id != $request->user_id) {
                return response()->json([
                    'status' => 'fail',
                    'data' => ['message' => 'Unauthorized']
                ], 403);
            }

            $task->update($validatedData);
            $task->load('category', 'user');

            return response()->json([
                'status' => 'success',
                'data' => [
                    'task' => new TaskResource($task)
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update task: ' . $e->getMessage()
            ], 500);
        }
    }
    /**
----------------------------------------------------------------
     * @desc delete a task.
     * @route DELETE /api/tasks/{id}
     * @access Private (Authenticated users only)
----------------------------------------------------------------
     */
    public function destroy(Request $request, string $id)
    {
        try {
            $task = Task::withTrashed()->findOrFail($id);

            $task->forceDelete();

            return response()->json([
                'status' => 'success',
                'data' => ['message' => 'Task deleted successfully.']
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete task: ' . $e->getMessage()
            ], 500);
        }
    }
    /**
----------------------------------------------------------------
     * @desc Archive a task.
     * @route GET /api/tasks/{id}
     * @access Private (Authenticated users only)
----------------------------------------------------------------
     */
    public function archive(Request $request, string $id)
    {
        try {
            $task = Task::findOrFail($id);

            if ($task->trashed()) {
                return response()->json([
                    'status' => 'fail',
                    'data' => ['message' => 'Task already archived.']
                ], 400);
            }

            $task->delete();

            return response()->json([
                'status' => 'success',
                'data' => ['message' => 'Task archived successfully.']
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to archive task: ' . $e->getMessage()
            ], 500);
        }
    }
    /**
----------------------------------------------------------------
     * @desc Restore a soft-deleted task..
     * @route GET /tasks/{id}/restore
     * @access Private (Authenticated users only)
----------------------------------------------------------------
     */
    public function restore(Request $request, string $id)
    {
        try {
            $task = Task::withTrashed()->findOrFail($id);

            if (!$task->trashed()) {
                return response()->json([
                    'status' => 'fail',
                    'data' => ['message' => 'Task not deleted']
                ], 400);
            }

            $task->restore();

            return response()->json([
                'status' => 'success',
                'data' => ['message' => 'Task restored successfully.']
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to restore task: ' . $e->getMessage()
            ], 500);
        }
    }
    /**
----------------------------------------------------------------
     * @desc Get all soft-deleted tasks.
     * @route GET /tasks/trashed
     * @access Private (Authenticated users only)
----------------------------------------------------------------
     */
    public function trashed()
    {
        try {
            $trashedTasks = Auth::user()->tasks()->onlyTrashed()->paginate(5);
            $trashedTasks->load('category', 'user');
            return response()->json([
                'status' => 'success',
                'data' => [
                    'trashed_tasks' => TaskResource::collection($trashedTasks),
                    'meta' => [
                        'current_page' => $trashedTasks->currentPage(),
                        'last_page' => $trashedTasks->lastPage(),
                        'per_page' => $trashedTasks->perPage(),
                        'total' => $trashedTasks->total(),
                    ]
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve trashed tasks: ' . $e->getMessage()
            ], 500);
        }
    }
}
