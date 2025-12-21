# Option.js

Biblioteca inspirada no `Option` do Rust para tratamento seguro de valores opcionais.

## Conceito

`Option<T>` encapsula valores que podem ou não existir:

- **Some(value)**: contém um valor
- **None**: ausência de valor

Elimina `null` e `undefined` explícitos, tornando a ausência de valores type-safe.

## Arquitetura

A lib é composta por:

- **Classe `Some<T>`**: representa a presença de um valor
- **Classe `None<T>`**: representa a ausência de valor
- **Namespace/Objeto `Option`**: factory methods e utilitários

## Estrutura da API

### Construtores

```typescript
some<T>(value: T): Option<T>
none<T>(): Option<T>
from<T>(value: T | null | undefined): Option<T>
```

### Verificação

```typescript
isSome(): boolean
isNone(): boolean
```

### Extração

```typescript
unwrap(): T  // throws se None
unwrapOr(defaultValue: T): T
unwrapOrElse(fn: () => T): T
```

### Transformação

```typescript
map<U>(fn: (value: T) => U): Option<U>
flatMap<U>(fn: (value: T) => Option<U>): Option<U>
filter(predicate: (value: T) => boolean): Option<T>
```

### Pattern Matching

```typescript
match<U>(handlers: { some: (value: T) => U; none: () => U }): U
```

## Princípios de Implementação

1. **Imutabilidade**: os métodos retornam novas instâncias
2. **Type Safety**: constructor privado, criação via métodos estáticos
3. **Null Safety**: `some()` rejeita null/undefined
4. **Composição**: métodos encadeáveis para programação funcional

## Exemplo de Uso

```typescript
const result = Option.from(findUser(id))
  .filter(user => user.active)
  .map(user => user.email)
  .unwrapOr('no-email@example.com');
```

## Testes Essenciais

- Criação: `some`, `none`, `from` com diversos tipos
- Verificação: `isSome` e `isNone` em ambos estados
- Extração: `unwrap` com Some/None, `unwrapOr`, `unwrapOrElse`
- Transformação: `map`, `flatMap`, `filter` preservando imutabilidade
- Edge cases: null, undefined, valores falsy

## Roadmap

- [ ] Métodos básicos (some, none, unwrap, map)
- [ ] Pattern matching
- [ ] Testes unitários
- [ ] Métodos adicionais (and, or, xor)
- [ ] Integração com Result
- [ ] Documentação completa

## Contribuindo

1. Mantenha a simplicidade e foco na API principal
2. Siga princípios funcionais (imutabilidade, composição)
3. Adicione testes para novos métodos
4. Mantenha consistência com a API do Rust quando possível
5. mantenha o código e comentários em inglês
