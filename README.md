<br/>
<p align="center">

  <img src="https://user-images.githubusercontent.com/25793226/167133926-cc1f51bb-2df4-4cc0-9cc0-cd6532cd5858.png" width=300px />
<p/>
<h1 align="center">Env-Typescript</h1>
<p align="center">new generation of env loader<p/>
<br/>
<br/>
<br/>

## Badges

[![CI](https://github.com/rhea-so-lab/env-typescript/actions/workflows/ci.yml/badge.svg)](https://github.com/rhea-so-lab/env-typescript/actions/workflows/ci.yml)

## Installation

```sh
npm i env-typescript
```

## Usage

### Global

```typescript
@LoadEnvironment() // ① load .env file
export class GlobalConfig {
  @Column()
  static MESSAGE: string; // ② load MESSAGE from .env file. if not exist this, exception will be create

  @Column()
  static AGE: number; // ③ Automatic Convert
}

process.env.MESSAGE; // YOUR_DATA
GlobalConfig.MESSAGE; // YOUR_DATA

process.env.AGE; // typeof string
GlobalConfig.AGE; // typeof number
```

### Local

```typescript
@LoadEnvironment('.env', { local: true }) // ① load .env file in local
export class GlobalConfig {
  @Column()
  static MESSAGE: string; // ② load MESSAGE from .env file. if not exist this, exception will be create
}

process.env.MESSAGE; // undefined
GlobalConfig.MESSAGE; // YOUR_DATA
```

### With default

```typescript
@LoadEnvironment() // ① load .env file
export class GlobalConfig {
  @Column()
  static MESSAGE: string = 'greeting'; // ② load MESSAGE from .env file. if not exist this, instead of 'greeting' will be use
}

process.env.MESSAGE; // greeting or YOUR_DATA
GlobalConfig.MESSAGE; // greeting or YOUR_DATA
```

### Multiple config with global

```typescript
@LoadEnvironment('aws.global.env')
export class AWS {
  @Column()
  static REGION: string;
}

@LoadEnvironment('aws.s3.env')
export class S3 {
  @Column()
  static BUCKET_NAME: string;
}

process.env.REGION;
AWS.REGION;
process.env.S3
S3.BUCKET_NAME;
```

## Configuration & Setup

```sh
git clone git@github.com:rhea-so-lab/env-typescript.git
cd env-typescript
npm i
npm run start:dev
npm run test # or this
```

## Questions

* [Issue](https://github.com/rhea-so-lab/env-typescript/issues)
* [jeonghyeon.rhea@gmail.com](mailto:jeonghyeon.rhea@gmail.com?subject=[github]%20rhea-so-lab%20/%env-typescript%20/%20question)

## Contributing

Welcome you to join the development of env-typescript.

Also, welcome PR or issue!

## License

MIT
