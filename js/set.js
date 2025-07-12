if (Set.prototype.intersection === undefined) {
  Set.prototype.intersection = function(other) {
    const intersectionArray = [...other].filter(x => this.has(x));
    return new Set(intersectionArray);
  }

  Set.prototype.union = function(other) {
    const unionArray = [...this, ...other];
    return new Set(unionArray);
  }
}
