import { Column, LoadEnvironment } from '../index';

@LoadEnvironment('config/test1')
export class Environment1 {
  @Column()
  static NAME: string;

  @Column()
  static MATH_SCORE: number;
}

@LoadEnvironment('config/test2')
export class Environment2 {
  @Column()
  static NAME: string;

  @Column()
  static SCIENCE_SCORE: number;
}

@LoadEnvironment('config/test3.env')
export class Environment3 {
  @Column()
  static NAME: string;

  @Column()
  static MATH_SCORE: number;
}

@LoadEnvironment('config/test4.env', { localOnly: true })
export class Environment4 {
  @Column()
  static TEST: string;
}

@LoadEnvironment()
export class Environment5 {
  @Column()
  static NAME: string;

  @Column()
  static MATH_SCORE: number;
}

describe('Environment Value', () => {
  it('01_test1.ini', () => {
    expect(Environment1.NAME).toBe('rhea');
    expect(Environment1.MATH_SCORE).toBe(0);
  });

  it('02_test2.ini', () => {
    expect(Environment2.NAME).toBe('hades');
    expect(Environment2.SCIENCE_SCORE).toBe(95);
  });

  it('03_test3.env', () => {
    expect(Environment3.NAME).toBe('rhea-so');
    expect(Environment3.MATH_SCORE).toBe(10);
  });

  it('04_test4.env', () => {
    expect(process.env.TEST).toBeUndefined(); // local only
    expect(Environment4.TEST).toBe('hi');
  });

  it('05_.env', () => {
    expect(Environment5.NAME).toBe('ayame');
    expect(Environment5.MATH_SCORE).toBe(88);
  });
});
