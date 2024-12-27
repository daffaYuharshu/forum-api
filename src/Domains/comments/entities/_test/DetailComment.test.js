const DetailComment = require("../DetailComment");

describe("a DetailComment entities", () => {
  it("should throw error when payload not contain needed property", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      username: "dicoding",
      content: "content",
    };

    // Action & Assert
    expect(() => new DetailComment(payload)).toThrowError(
      "DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      id: 123,
      username: "dicoding",
      content: true,
      date: "2021-08-08T07:19:09.775Z",
      replies: [],
    };

    // Action and Assert
    expect(() => new DetailComment(payload)).toThrowError(
      "DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create detailComment object correctly", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      username: "dicoding",
      date: "2021-08-08T07:19:09.775Z",
      replies: [],
      content: "content",
    };

    // Action
    const { id, username, content, date, replies } = new DetailComment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(replies).toEqual(payload.replies);
    expect(content).toEqual(payload.content);
  });
});
