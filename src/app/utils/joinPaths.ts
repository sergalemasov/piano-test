export function joinPaths(...paths: string[]): string {
  return paths.reduce((prev: string, curr: string): string => {
    const [prevStripped, currStripped] = [prev, curr].map((path: string, index: number): string => {
      const pathStripped = path.replace(/\/+$/, '');

      return index === 0
        ? pathStripped
        : pathStripped.replace(/^\/+/, '');
    });

    if (!prevStripped) {
      return currStripped;
    }

    return currStripped
      ? `${prevStripped}/${currStripped}`
      : prevStripped;
  });
}
