# Lista de posts

Si navegamos a la página principal, podemos ver un marcador de posición vacío donde se mostrará la lista de posts.

¿De dónde podemos obtener la lista de posts? De **Content Island**.

**Comprobación rápida de la lista de posts de Content Island**

Vamos a obtener la lista de posts desde Content Island.

Vamos a crear un nuevo **Pod** y lo llamaremos **post-collection**.

Agreguemos el modelo de post en un nuevo archivo llamado **post-collection.model.ts**.

**Copiar desde Content Island**

_./src/pods/post-collection/post-collection.model.ts_

```ts
import type { Media } from "@content-island/api-client";

export interface Post {
  id: string;
  language: "en";
  title: string;
  slug: string;
  date: string; // Almacena la fecha en formato ISO 8601. Por ejemplo: 2021-09-10T19:30:00.000Z
  summary: string;
  image: Media;
  content: string;
  readTime: number;
}
```

Y la API para cargar los posts:

_./src/pods/post-collection/post-collection.api.ts_

```ts
import client from "#lib/client.ts";
import type { Post } from "./post-collection.model";

export const getAllPosts = async () =>
  await client.getContentList<Post>({
    contentType: "Post",
    sort: { "fields.date": "desc" },
    pagination: { take: 6 },
  });
```

Esta vez llamaremos a `getAllPosts` dentro del pod de posts, pero podríamos hacer la llamada en la página **index** y pasar las posts como *props* al componente de lista de posts.

Vamos a crear un nuevo archivo pod llamado **post-collection.pod.astro** y verificar que los datos se estén cargando correctamente.

_./src/pods/post-collection/post-collection.pod.astro_

```astro
---
import { getAllPosts } from './post-collection.api.ts';

const posts = await getAllPosts();
---
<section class="flex flex-1 flex-col gap-9">
{posts.map((post) => (
      <h2>{post.title}</h2>
))}
</section>
```

Ahora vamos a usar este pod de posts:

_./src/pages/index.astro_

```diff
---
import Layout from '#layouts/layout.astro';
import { getCollection } from 'astro:content';
import Hero from '#components/hero.astro';
import MiniBioPod from '#pods/mini-bio/mini-bio.pod.astro';
import NewsletterPod from '#pods/newsletter/newsletter.pod.astro';
import PopularPosts from '#pods/popular-posts/popular-posts.astro';
+ import PostCollectionPod from '#pods/post-collection/post-collection.pod.astro';

const homeContent = {
  hero: {
    title: "John's Web Dev Blog",
    description: 'Aquí puedes encontrar varios artículos sobre desarrollo de aplicaciones web.',
  },
};
---
```

```diff
  </Hero>

-  <div>Place holder for post preview collection</div>
+  <PostCollectionPod />

  <Fragment slot="aside">
```

Si ejecutamos el proyecto, deberíamos ver la lista de posts (solo los títulos por ahora).

```bash
npm run dev
```

Vamos a darle algo de estilo. Crearemos un componente que mostrará una **tarjeta de post**.

Creamos una nueva carpeta dentro del pod **post-collection** llamada **components** y dentro de ella un nuevo archivo llamado **post-card.astro**.

Primero definiremos el código en la parte superior:

_./src/pods/post-collection/components/post-card.astro_

```astro
---
import HeartIcon from '#assets/icons/heart.svg';
import type { Post } from '../post-collection.model';

interface Props {
  post: Post;
}
const { post } = Astro.props;
const readTimeLabel = 'min read';
---
```

Y ahora vamos por el marcado HTML:

```astro
<a
  href={`/posts/${post.slug}`}
  class="group @container cursor-pointer rounded-4xl transition-shadow duration-300 hover:shadow-lg"
>
  <article class="flex h-full flex-col @lg:flex-row">
    <div class="aspect-[16/9] overflow-hidden rounded-4xl bg-gray-300 @lg:flex-1">
      <img
        src={post.image.url}
        alt={post.title}
        class="h-full w-full rounded-4xl object-cover transition-transform duration-300 group-hover:scale-[1.06]"
        aria-hidden="true"
      />
    </div>
    <div class="flex flex-1 flex-col justify-between gap-6 p-4 @lg:flex-2">
      <div>
        <time datetime={post.date} class="mb-1 block text-xs">
          {
            new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          }
        </time>
        <h3
          class="group-hover:text-primary-700 text-tbase-500/90 mb-2 text-xl font-bold transition-colors duration-300"
        >
          {post.title}
        </h3>
        <p class="text-sm">{post.summary}</p>
      </div>

      <div class="flex items-center gap-4">
        <span class="text-xs">{post.readTime} {readTimeLabel}</span>
        <div class="flex items-center gap-1">
          <HeartIcon class="h-5 w-5" />
          <span class="text-xs">{6}</span>
        </div>
      </div>
    </div>
  </article>
</a>
```

Y vamos a usarlo en nuestro pod de colección de publicaciones:

_./src/pods/post-collection/post-collection.pod.astro_

```diff
---
import { getAllPosts } from './post-collection.api.ts';
+ import PostCard from './components/post-card.astro';

const posts = await getAllPosts();
---

<section class="flex flex-1 flex-col gap-9">
-  {posts.map(post => <h2>{post.title}</h2>)}
+  {posts.map(post => <PostCard post={post} />)}
</section>
```

Nada mal, ahora vamos a darle un poco más de estilo...

_./src/pods/post-collection/post-collection.pod.astro_

```diff
<section class="flex flex-1 flex-col gap-9">
+  <div class="grid max-w-[895px] gap-8 xl:grid-cols-2">

  {posts.map(post => <PostCard post={post} />)}
+  </div>

</section>
```

Y listo 😊, ahora si hacemos clic en una publicación obtendremos un error **404**, pero lo arreglaremos en el siguiente paso: mostrar una sola publicación.
