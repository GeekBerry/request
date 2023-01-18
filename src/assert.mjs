function assert(condition, errorMessage) {
  if (!condition) {
    throw new Error(errorMessage);
  }
}

export default assert;
