const AddThread = require("../AddThread");

describe("a AddThread entities", () => {
    

  it("should throw error when payload not contain needed property", () => {
    // Arrange
    const payload = {
      title: "ini title",
    };

    // Action & Assert
    expect(() => new AddThread(payload)).toThrowError(
      "ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      title: 123,
      body: "ini body",
    };

    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError(
      "ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create addThread object correctly", () => {
    // Arrange
    const payload = {
      title: "ini title",
      body: "ini body",
    };

    // Action
    const { title, body } = new AddThread(payload);

    // Assert
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
  });
});
