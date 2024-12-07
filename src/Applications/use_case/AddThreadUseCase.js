const AddThread = require("../../Domains/threads/entities/AddThread");

class AddThreadUseCase {
  constructor({ threadRepository, authenticationTokenManager }) {
    this._threadRepository = threadRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCasePayload) {
    const addthread = new AddThread(useCasePayload);
    return this._threadRepository.addThread(addthread);
  }
}

module.exports = AddThreadUseCase;
