import { Column, LoadFile } from '../index';

@LoadFile('config/test1')
export class INITest1 {
  @Column()
  static NAME: string;

  @Column()
  static MATH_SCORE: number;
}

@LoadFile('config/test2')
export class INITest2 {
  @Column()
  static NAME: string;

  @Column()
  static SCIENCE_SCORE: number;
}

@LoadFile('config/test3.env')
export class INITest3 {
  @Column()
  static NAME: string;

  @Column()
  static MATH_SCORE: number;
}

@LoadFile('config/test4.env', { withProcessEnv: true })
export class INITest4 {
  @Column()
  static NAME: string;

  @Column()
  static MATH_SCORE: number;
}

@LoadFile()
export class INITest5 {
  @Column()
  static NAME: string;

  @Column()
  static MATH_SCORE: number;
}

describe('Environment Value', () => {
  it('01_test1.ini', () => {
    expect(INITest1.NAME).toBe('rhea');
    expect(INITest1.MATH_SCORE).toBe(0);
  });

  it('02_test2.ini', () => {
    expect(INITest2.NAME).toBe('hades');
    expect(INITest2.SCIENCE_SCORE).toBe(95);
  });

  it('03_test3.env', () => {
    expect(INITest3.NAME).toBe('rhea-so');
    expect(INITest3.MATH_SCORE).toBe(10);
  });

  it('04_test4.env', () => {
    expect(process.env.NAME).toBe('naver');
    expect(process.env.MATH_SCORE).toBe('50');
  });

  it('05_.env', () => {
    expect(INITest5.NAME).toBe('ayame');
    expect(INITest5.MATH_SCORE).toBe(88);
  });
});
