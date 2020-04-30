function camelize (str: String) {
  return str.replace(/-(\w)/g, (_, c) => c ? c.toUpperCase() : '')
}

export default camelize
