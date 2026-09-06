const { lstatSync } = require('node:fs');

const isSymbolicLink = (file) => {
  try {
    return lstatSync(file).isSymbolicLink();
  } catch {
    return false;
  }
};

module.exports = {
  '*': (files) => {
    const formattable = files.filter((file) => !isSymbolicLink(file));

    if (formattable.length === 0) {
      return [];
    }

    return [
      `prettier --ignore-unknown --write ${formattable
        .map((file) => `"${file}"`)
        .join(' ')}`,
    ];
  },
};
