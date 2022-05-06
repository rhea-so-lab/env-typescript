/* eslint-disable @typescript-eslint/ban-types */
import 'reflect-metadata';
import * as fs from 'fs';
import path from 'path';
import ini from 'ini';

export const INIStorage: Map<
  string,
  {
    name: string;
    type: Function;
  }[]
> = new Map<string, { name: string; type: Function }[]>();

/**
 * ### Example
 * ```typescript
 * ㅤ@LoadFile('local')
 * ㅤclass INISetting {
 * ㅤ	@Column()
 * ㅤ	value1: string
 * ㅤ}
 * ```
 */
export function Column(): PropertyDecorator {
  return (object: any, propertyName: string): void => {
    const reflectMetadataType: any =
      Reflect && Reflect.getMetadata
        ? Reflect.getMetadata('design:type', object, propertyName)
        : undefined;
    let storage:
      | {
          name: string;
          type: Function;
        }[]
      | undefined = INIStorage.get(object.name);
    if (storage === undefined) {
      storage = [];
      INIStorage.set(object.name, storage);
    }
    storage?.push({ name: propertyName, type: reflectMetadataType });
  };
}

interface ILoadFileOptions {
  /** process.env에 inject 합니다. type은 string으로 고정됩니다. number를 넣어도 string, boolean을 넣어도 string. */
  withProcessEnv?: boolean;
}

/**
 * ini 파일을 읽어와주는 데코레이터입니다.
 * 들고 오고 싶은 ini 파일의 이름을 적어주세요. 이름만!
 * ### Example
 * ```typescript
 * ㅤ@LoadFile('local')
 * ㅤclass INISetting {}
 * ```
 */
export function LoadFile(filename?: string, options?: ILoadFileOptions): ClassDecorator {
  if (filename === undefined) {
    filename = '.env';
  } else if (!filename.includes('.env') && !filename.includes('.ini')) {
    filename += '.ini';
  }

  return (object: any): void => {
    const parsedData: {
      [key: string]: any;
    } = ini.parse(
      fs.readFileSync(path.join(process.cwd(), `${filename}`), {
        encoding: 'utf-8',
      }),
    );
    const columns: {
      name: string;
      type: Function;
    }[] = INIStorage.get(object.name);
    if (columns) {
      for (const index in parsedData) {
        const column: {
          name: string;
          type: Function;
        } = columns.find((column: { name: string; type: Function }) => column.name === index);

        // Validation - INI에는 정의되어있는데, Class에는 정의되어있지 않으면 에러 발생
        if (column === undefined) {
          throw new Error(`${index} is not defined in ${object.name}`);
        }

        object[index] = column.type(parsedData[index]);

        // 인자로 true를 넣었을때만 반응
        if (options?.withProcessEnv === true) {
          process.env[index] = column.type(parsedData[index]);
        }
      }

      // Validation - Class에는 정의되어있는데, INI에는 정의되어있지 않으면 에러 발생
      for (const column of columns) {
        if (object[column.name] === undefined) {
          throw new Error(`${column.name} is not defined in ${filename}`);
        }
      }
    }
  };
}
