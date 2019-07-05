# pojo-repository
Repository interfaces for CRUD operations on plain-old-javascript/json-objects (pojos), and HttpRestRepositry provider for use with standard rest apis.

All methods are asynchonous using the Promise API.

## Installation

Install with npm:

```shell
npm install pojo-repository
```

Or with yarn:

```shell
yarn add pojo-repository
```

## Basic Usage

### Import
```ts
import { HttpRestRepository, HttpRestReadRepository } from 'pojo-repository';
```

### Reading a model from its source

```ts

let repository = new HttpRestRepository<MyModel>('https://...');

let model = repository.find('my_id');
```

### Saving changes to a model

```ts

let repository = new HttpRestRepository<MyModel>('https://...');

let model = repository.find('my_id');
model.name = 'frog';

repository.save(model.id, model);

```

### Creating and saving new models

```ts

let repository = new HttpRestRepository<MyModel>('https://...');

let model = await repository.create();
model.name = 'frog';

await repository.save(model.id, model, true /* Will perform POST instead of PUT for new records. */);

```

### Removing models

```ts

let repository = new HttpRestRepository<MyModel>('https://...');

await repository.remove('my_id');

```

## Readonly Repositories

A read-only APi for sources that cannot be saved to is available as the ReadRepository interface and HttpRestReadRepository class.

```ts

let repository = new HttpRestReadRepository<MyModel>('https://...');

let model = repository.find('my_id');

// repository is readonly, save(), create(), remove() are not available.
```

## Authorization or Custom Headers

HttpRestRespository and HttpRestReadRepository use [ApiFetch from apifetch-json](https://github.com/scottbamford/apifetch-json#readme) internally.  You can pass an optional pre-configured ApiFetch object to the repository constructor
to handle authorization or other special HTTP options.

```ts

let apiFetch = new ApiFetch({
        headers: {
            'Authorization': `Bearer ${userState.token}`
        }
    });

let repository = new HttpRestReadRepository<MyModel>('https://...', apiFetch);

let model = repository.find('my_id');

```

For more examples of using ApiFetch check out the [apifetch-json project](https://github.com/scottbamford/apifetch-json#readme).

## Custom Repositories

You an also provide your own Repository and ReadRespository implementations by implementing the Repository or RepositoryRead interfaces.

```ts
import { HttpRestRepository, HttpRestReadRepository } from 'pojo-repository';

export class CustomRepository<T = any, Key = any> implements Repository {
    /**
     * Constructor.
     */
    constructor() {
    }

    /**
     * Find an model in the store by its key.  If no match is found null is returned.
     * @param id
     */
    async find(id: string): Promise<T> {
        // Custom code here.
    }

    /**
     * Get all models in the store.
     */
    async findAll(): Promise<Array<T>> {
        // Custom code here.
    }

    /**
     * Create a new model.
     *
     * NOTE this does not add the model to the store.  That is only done if save() is called on the returned model.
     */
    async create(): Promise<T> {
        // Custom code here.
    }

    /**
     * Save a model back to it's store.
     * @param id
     * @param model
     * @param isCreate
     */
    async save(id: string, model: T, isCreate?: boolean): Promise<void> {
        // Custom code here.
    }

    /**
     * Remove a model from the store.
     * @param id
     */
    async remove(id: string): Promise<void> {
        // Custom code here.
    }
}
```

## Javascript Usage

pojo-repository works just as well with Javascript as Typescript.  All you need to do is
remove the type information from the above examples.

Here are the basic usage examples in plain Javascript:

### Import
```js
import { HttpRestRepository, HttpRestReadRepository } from 'pojo-repository';
```

### Reading a model from its source

```js

var repository = new HttpRestRepository('https://...');

var model = repository.find('my_id');
```

### Saving changes to a model

```ts

var repository = new HttpRestRepository('https://...');

var model = repository.find('my_id');
model.name = 'frog';

repository.save(model.id, model);

```

### Creating and saving new models

```js

var repository = new HttpRestRepository('https://...');

var model = await repository.create();
model.name = 'frog';

await repository.save(model.id, model, true /* Will perform POST instead of PUT for new records. */);

```

### Removing models

```ts

var repository = new HttpRestRepository('https://...');

await repository.remove('my_id');

```

## Readonly Repositories

A read-only APi for sources that cannot be saved to is available as the ReadRepository interface and HttpRestReadRepository class.

```ts

var repository = new HttpRestReadRepository('https://...');

var model = repository.find('my_id');

// repository is readonly, save(), create(), remove() are not available.
```

## Typescript

This project is written in typescript and comes with its own bindings.

## License

Licensed under the MIT license.