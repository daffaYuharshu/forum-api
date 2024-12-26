const AddThread = require("../../Domains/threads/entities/AddThread");

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, ownerId) {
    if (!ownerId) {
      throw new Error("ADD_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PARAMETER");
    }

    if (typeof ownerId !== "string") {
      throw new Error(
        "ADD_THREAD_USE_CASE.PARAMETER_NOT_MEET_DATA_TYPE_SPECIFICATION"
      );
    }

    const addThread = new AddThread(useCasePayload);
    return this._threadRepository.addThread(addThread, ownerId);
  }
}

module.exports = AddThreadUseCase;
