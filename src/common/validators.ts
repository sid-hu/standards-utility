export function arrayRequired() {
  return (value: []) => {
    return {
      valid: value.length > 0,
      name: "required",
    }
  }
}
