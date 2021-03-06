interface TemplateSettings {
  [index: number]: {
    width: number;
    height: number;
    gravity: string;
  }
}

export default {
  0: {
    width: 1920,
    height: 400,
    gravity: 'center',
  },
  1: {
    width: 1920,
    height: 1080,
    gravity: 'center',
  },
  2: {
    width: 800,
    height: 1080,
    gravity: 'west',
  },
  3: {
    width: 1920,
    height: 400,
    gravity: 'center',
  },
  4: {
    width: 1920,
    height: 1080,
    gravity: 'center',
  },
  5: {
    width: 800,
    height: 1080,
    gravity: 'west',
  },
  6: {
    width: 1920,
    height: 400,
    gravity: 'center',
  },
} as TemplateSettings;