const LikeRepository = require("../../../Domains/likes/LikeRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const LikeUseCase = require("../LikeUseCase");

describe("LikeUseCase", () => {
  it("should throw error if like comment not contain needed parameter", async () => {
    /** creating use case instance */
    const likeUseCase = new LikeUseCase({});

    // Action & Assert
    await expect(likeUseCase.execute()).rejects.toThrow(
      "LIKE_USE_CASE.NOT_CONTAIN_NEEDED_PARAMETER"
    );
  });

  it("should throw error if like comment parameter not meet data type specification", async () => {
    /** creating use case instance */
    const likeUseCase = new LikeUseCase({});

    // Action & Assert
    await expect(likeUseCase.execute(123, true, "user-123")).rejects.toThrow(
      "LIKE_USE_CASE.PARAMETER_NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should orchestrating the add like action correctly when comment is not liked by user", async () => {
    // Arrange
    const userId = "user-123";
    const threadId = "thread-123";
    const commentId = "comment-123";

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.verifyLikeAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve(false));
    mockLikeRepository.addLike = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const likeUseCase = new LikeUseCase({
      likeRepository: mockLikeRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await likeUseCase.execute(userId, threadId, commentId);

    // Assert
    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith(
      threadId
    );
    expect(
      mockCommentRepository.verifyCommentAvailability
    ).toHaveBeenCalledWith(commentId);
    expect(mockLikeRepository.verifyLikeAvailability).toHaveBeenCalledWith(
      userId,
      commentId
    );
    expect(mockLikeRepository.addLike).toHaveBeenCalledWith(userId, commentId);
  });

  it("should orchestrating the delete like action correctly when comment is liked by user", async () => {
    // Arrange
    const userId = "user-123";
    const threadId = "thread-123";
    const commentId = "comment-123";

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.verifyLikeAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve(true));
    mockLikeRepository.deleteLike = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const likeUseCase = new LikeUseCase({
      likeRepository: mockLikeRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await likeUseCase.execute(userId, threadId, commentId);

    // Assert
    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith(
      threadId
    );
    expect(
      mockCommentRepository.verifyCommentAvailability
    ).toHaveBeenCalledWith(commentId);
    expect(mockLikeRepository.verifyLikeAvailability).toHaveBeenCalledWith(
      userId,
      commentId
    );
    expect(mockLikeRepository.deleteLike).toHaveBeenCalledWith(
      userId,
      commentId
    );
  });
});
