const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetThreadByIdUseCase = require('../../../../Applications/use_case/GetThreadByIdUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadByIdHandler = this.getThreadByIdHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const { id: ownerId } = request.auth.credentials;
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute(
      request.payload,
      ownerId,
    );

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadByIdHandler(request, h) {
    const { threadId } = request.params;
    const getThreadByIdUseCase = this._container.getInstance(
      GetThreadByIdUseCase.name
    );
  
    try {
      const thread = await getThreadByIdUseCase.execute(threadId);
  
      return {
        status: 'success',
        data: { thread },
      };
    } catch (error) {
      console.error(error);  // Log the error for debugging purposes
  
      // Handle specific error cases or send a generic error response
      return h.response({
        status: 'fail',
        message: error.message || 'An unexpected error occurred.',
      }).code(500);
    }
  }
  
}

module.exports = ThreadsHandler;
