Useful utils for [gist.cafe](https://gist.cafe) Deno Apps.

## Usage

Simple usage example:

```ts
import { Inspect } from "https://deno.land/x/gistcafe@v1.0.0/Inspect.ts";

let orgName = "denoland";

let orgRepos = (await (await fetch(`https://api.github.com/orgs/${orgName}/repos`)).json())
    .map((x:any) => ({
        name: x.name,
        description: x.description,
        lang: x.language,
        watchers: x.watchers_count,
        forks: x.forks
    }));

orgRepos.sort((a:any, b:any) => b.watchers - a.watchers);

console.log(`Top 3 ${orgName} Github Repos:`);
Inspect.printDump(orgRepos.slice(0, 3));

console.log(`\nTop 10 ${orgName} Github Repos:`);
Inspect.printDumpTable(orgRepos.map((x:any) => ({
    name: x.name, lang: x.lang, watchers: x.watchers, forks: x.forks
})).slice(0, 10));
```

That can be run with:

    $ deno run --allow-net=api.github.com --unstable index.ts

Which outputs:

```
Top 3 denoland Github Repos:
[
    {
        name: deno,
        description: A secure JavaScript and TypeScript runtime,
        lang: TypeScript,
        watchers: 71592,
        forks: 3743
    },
    {
        name: rusty_v8,
        description: V8 javascript bindings for Rust,
        lang: Rust,
        watchers: 1534,
        forks: 130
    },
    {
        name: deno_std,
        description: deno standard modules,
        lang: TypeScript,
        watchers: 1039,
        forks: 121
    }
]

Top 10 denoland Github Repos:
+--------------------------------------------------+
|       name       |    lang    | watchers | forks |
|--------------------------------------------------|
| deno             | TypeScript |    71592 |  3743 |
| rusty_v8         | Rust       |     1534 |   130 |
| deno_std         | TypeScript |     1039 |   121 |
| vscode_deno      | TypeScript |      990 |    54 |
| deno_install     | PowerShell |      767 |   105 |
| deno_website2    | TypeScript |      674 |   571 |
| deno_lint        | Rust       |      595 |    75 |
| registry         | JavaScript |      151 |    52 |
| doc_website      | TypeScript |      144 |    31 |
| deno_third_party | null       |       74 |    39 |
+--------------------------------------------------+
```

## Features and bugs

Please file feature requests and bugs at the [issue tracker](https://github.com/ServiceStack/gistcafe-deno/issues).