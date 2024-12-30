const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should throw error if add comment not contain needed parameter', async () => {
    // Arrange
    const useCasePayload = {
      content: 'content',
    };

    /** creating use case instance */
    const addCommentUseCase = new AddCommentUseCase({});

    // Action & Assert
    await expect(
      addCommentUseCase.execute(useCasePayload, null, null),
    ).rejects.toThrow('ADD_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PARAMETER');
  });

  it('should throw error if add comment parameter not meet data type specification', async () => {
    // Arrange
    const useCasePayload = {
      content: 'content',
    };

    /** creating use case instance */
    const addCommentUseCase = new AddCommentUseCase({});

    // Action & Assert
    await expect(
      addCommentUseCase.execute(useCasePayload, 123, true),
    ).rejects.toThrow('ADD_COMMENT_USE_CASE.PARAMETER_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'content',
    };
    const mockAddedComment = new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: 'user-123',
    });

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment));

    /** creating use case instance */
    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedComment = await addCommentUseCase.execute(
      useCasePayload,
      'user-123',
      'thread-123',
    );

    // Assert
    expect(addedComment).toStrictEqual(
      new AddedComment({
        id: 'comment-123',
        content: 'content',
        owner: 'user-123',
      }),
    );

    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(
      'thread-123',
    );
    expect(mockCommentRepository.addComment).toBeCalledWith(
      new AddComment({
        content: 'content',
      }),
      'user-123',
      'thread-123',
    );
  });
});
