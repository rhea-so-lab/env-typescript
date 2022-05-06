/* eslint-disable @typescript-eslint/ban-types */
import 'reflect-metadata';
import * as fs from 'fs';
import path from 'path';
import ini from 'ini';

const globalStorage: Map<
  string,
  {
    name: string;
    type: Function;
  }[]
> = new Map<string, { name: string; type: Function }[]>();

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
      | undefined = globalStorage.get(object.name);
    if (storage === undefined) {
      storage = [];
      globalStorage.set(object.name, storage);
    }
    storage?.push({ name: propertyName, type: reflectMetadataType });
  };
}

interface ILoadFileOptions {
  localOnly?: boolean;
}

export function LoadEnvironment(filename?: string, options?: ILoadFileOptions): ClassDecorator {
  if (filename === undefined) {
    filename = '.env';
  } else if (!filename.includes('.env') && !filename.includes('.ini')) {
    filename += '.env';
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
    }[] = globalStorage.get(object.name);

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
        if (!options?.localOnly) {
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
