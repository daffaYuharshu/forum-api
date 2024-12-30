const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should throw error if add thread not contain needed parameter', async () => {
    // Arrange
    const useCasePayload = {
      title: 'ini title',
      body: 'ini body',
    };

    /** creating use case instance */
    const addThreadUseCase = new AddThreadUseCase({});

    // Action & Assert
    await expect(
      addThreadUseCase.execute(useCasePayload, null),
    ).rejects.toThrow('ADD_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PARAMETER');
  });

  it('should throw error if add thread parameter not meet data type specification', async () => {
    // Arrange
    const useCasePayload = {
      title: 'ini title',
      body: 'ini body',
    };

    /** creating use case instance */
    const addThreadUseCase = new AddThreadUseCase({});

    // Action & Assert
    await expect(
      addThreadUseCase.execute(useCasePayload, 123),
    ).rejects.toThrow('ADD_THREAD_USE_CASE.PARAMETER_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'ini title',
      body: 'ini body',
    };
    const mockAddedThread = new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: 'user-123',
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.addThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread));

    /** creating use case instance */
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await addThreadUseCase.execute(
      useCasePayload,
      'user-123',
    );

    // Assert
    expect(addedThread).toStrictEqual(
      new AddedThread({
        id: 'thread-123',
        title: 'ini title',
        owner: 'user-123',
      }),
    );
    expect(mockThreadRepository.addThread).toBeCalledWith(
      new AddThread({
        title: 'ini title',
        body: 'ini body',
      }),
      'user-123',
    );
  });
});
