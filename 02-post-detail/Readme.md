# 02 Detalle de Post

Vamos a mostrar la página de detalle del Post.

Actualmente, si intentamos navegar a una página de detalle específica de un Post, obtenemos un error 404.

Comencemos creando la página de detalle del Post.

Agrega una nueva carpeta **post** dentro de **src/pages**. Dentro de esa carpeta, crea un nuevo archivo llamado **index.astro**, y agrega, por ejemplo, lo siguiente:

_./src/pages/posts/index.astro_

```astro
<h1>Hey soy el detalle del Post</h1>
```

Pero esto no funcionará. Necesitamos una ruta por cada Post. En Content Island tenemos un campo llamado `slug` que podemos usar para crear una ruta dinámica, y luego vincular cada Post con ella.

Entonces, ¿qué podemos hacer? Astro proporciona una forma de crear rutas dinámicas usando corchetes:

- Puedes agregar uno o más segmentos al nombre del archivo usando corchetes para indicar un segmento dinámico.
- El nombre dentro de los corchetes se convierte en la propiedad que puedes usar para acceder al valor de ese segmento.
- Con _getStaticPaths_, puedes decirle a Astro qué páginas debe generar en tiempo de compilación.

Si eres fan de Marvel, piensa en _Infinity War_ cuando el Dr. Strange miró millones de futuros y solo vio uno donde ganaban. Es más o menos lo que estamos haciendo aquí: decirle a Astro exactamente qué páginas generar durante la compilación.

Así que renombramos el archivo de _index.astro_ a:

_./src/pages/posts/[slug].astro_

Y ahora calculemos todas las rutas que necesitamos generar usando _getStaticPaths_.

Para hacerlo, necesitamos:

- Obtener la lista de Posts desde Content Island.
- Para cada Post, devolver un objeto con una propiedad `params` que contenga el slug del Post.
- Luego usar las props para renderizar el detalle del Post.

Ya tenemos una API y un modelo disponibles en el pod **post-collection**. En este punto, podríamos:

1. Reutilizar esa API y modelo en la página.  
2. Copiar la API y el modelo dentro de la página.  
3. Promoverlos a código compartido que pueda reutilizarse.

Por simplicidad, reutilizaremos directamente la API y el modelo en la página.

_./src/pages/posts/[slug].astro_

```astro
---
import Layout from '#layouts/layout.astro';
import { getAllPosts } from '#pods/post-collection/post-collection.api';
import type { Post } from '#pods/post-collection/post-collection.model';

// Generar todas las rutas posibles
export async function getStaticPaths() {
  const postEntries = await getAllPosts();
  return postEntries.map(entry => ({
    params: { slug: entry.slug },
    props: { entry },
  }));
}

// Por cada ruta generamos la página
const { entry } = Astro.props;
---
```

Verifiquemos que el detalle del Post se esté mostrando.

_./src/pages/posts/[slug].astro_

```diff
---
- <h1>Hey I'm the post detail</h1>
+ <Layout title={entry.title}>
+  <h2>{entry.title}</h2>
+ </Layout>
```

Ejecutemos esto para comprobar que todo funcione correctamente.

```bash
npm run dev
```

Hora de agregar algo de diseño :)

Agreguemos un componente **hero** para mostrar el título del Post.

_./src/pages/posts/[slug].astro_

```diff
---
import Layout from '#layouts/layout.astro';
+ import Hero from '#components/hero.astro';
import { getAllPosts } from '#pods/post-collection/post-collection.api';
```

_./src/pages/posts/[slug].astro_

```diff
---
 <Layout title={entry.title}>
+  <Hero url={entry.image.url} slot="hero" />
  <h2>{entry.title}</h2>
 </Layout>
```

En el *aside* tenemos diferentes elementos, así que definámoslos aquí:

_./src/pages/posts/[slug].astro_

```diff
---
import Layout from '#layouts/layout.astro';
import Hero from '#components/hero.astro';
+ import MiniBioPod from '#pods/mini-bio/mini-bio.pod.astro';
+ import NewsletterPod from '#pods/newsletter/newsletter.pod.astro';
+ import PopularPostsPod from '#pods/popular-posts/popular-posts.astro';
import { getAllPosts } from '#pods/post-collection/post-collection.api';
```

_./src/pages/posts/[slug].astro_

```diff
---
 <Layout title={entry.title}>
  <Hero url={entry.image.url} slot="hero" />
  <h2>{entry.title}</h2>
+  <Fragment slot="aside">
+    <MiniBioPod type="card" />
+    <NewsletterPod type="mini" />
+    <PopularPostsPod />
+  </Fragment>

 </Layout>
```

Probémoslo:

```bash
npm run dev
```

Ahora profundicemos en el contenido del Post. Crearemos un componente separado para esto.

_src/pods/post/post.pod.astro_

```astro
---
import type { Post } from '#pods/post-collection/post-collection.model';

interface Props {
  postEntry: Post;
}

const { postEntry } = Astro.props;

const likeCount = 6;

const postContent = {
  backButton: 'Go back',
  published: 'Published',
  minRead: 'min read',
};
---

<section class="flex shrink-1 grow flex-col gap-12 px-6 py-4">
  <div>{postEntry.title}</div>
  <div>{postEntry.content}</div>
</section>
```

Usémoslo en la página de detalle del Post.

_./src/pages/posts/[slug].astro_

```diff
---
import Layout from '#layouts/layout.astro';
import Hero from '#components/hero.astro';
import MiniBioPod from '#pods/mini-bio/mini-bio.pod.astro';
import NewsletterPod from '#pods/newsletter/newsletter.pod.astro';
import PopularPostsPod from '#pods/popular-posts/popular-posts.astro';
import { getAllPosts } from '#pods/post-collection/post-collection.api';
+ import PostPod from '#pods/post/post.pod.astro';

// Generar todas las rutas posibles
export async function getStaticPaths() {
  const postEntries = await getAllPosts();
  return postEntries.map(entry => ({
    params: { slug: entry.slug },
    props: { entry },
  }));
}

// Por cada ruta generamos la página
const { entry } = Astro.props;
---

<Layout title={entry.title}>
  <Hero url={entry.image.url} slot="hero" />
-  <h2>{entry.title}</h2>
+  <PostPod postEntry={entry} />
  <Fragment slot="aside">
    <MiniBioPod type="card" />
    <NewsletterPod type="mini" />
    <PopularPostsPod />
  </Fragment>
</Layout>
```

Funciona, pero aún no se ve muy bien. Si lo comparamos con el Post original, vemos que necesitamos tanto un encabezado como un cuerpo.  
Creemos dos nuevos componentes; para eso, dentro del pod **post** agrega una nueva carpeta llamada **components**.

_src/pods/post/components/header.astro_

```astro
---
import ArrowLeftIcon from '#assets/icons/arrow-left.svg';

interface Props {
  gobackText: string;
  publishedText: string;
  date: string;
}
const { gobackText, publishedText, date } = Astro.props;
---

<header class="flex items-start justify-between">
  <a href="/" class="hover:text-primary-600 flex items-center gap-2 font-semibold transition-colors">
    <ArrowLeftIcon />
    {gobackText}
  </a>

  <p class="text-sm">
    {publishedText}{' '}
    <time datetime={date}>
      {
        new Date(date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      }
    </time>
  </p>
</header>
```

_src/pods/post/post.pod.astro_

```diff
---
import type { Post } from '#pods/post-collection/post-collection.model';
+ import Header from '#pods/post/components/header.astro';

// (...)
---

<section class="flex shrink-1 grow flex-col gap-12 px-6 py-4">
+ <Header gobackText={postContent.backButton} publishedText={postContent.published} date={postEntry.date} />
  <div>{postEntry.title}</div>
  <div>{postEntry.content}</div>
</section>
```

Se ve mejor… ahora creemos el componente **body**.

Primero, definimos el componente y su código del lado del servidor:

_src/pods/post/components/body.astro_

```astro
---
import HeartIcon from '#assets/icons/heart.svg';
import type { Post } from '#pods/post-collection/post-collection.model';

interface Props {
  entry: Post;
  likeCount: number;
  minReadText: string;
}

const { entry, likeCount, minReadText } = Astro.props;
---
```

Y el marcado:

_src/pods/post/components/body.astro_

```astro
<div class="flex flex-col gap-6">
  <h1 class="text-tbase-500/90 text-5xl leading-[1.1] font-bold" id="article-section-heading">
    {entry.title}
  </h1>

  <div class="border-tbase-500/40 mb-2 flex items-center justify-between gap-4 border-y py-2">
    <p class="text-xs">{entry.readTime} {minReadText}</p>
    <div class="flex items-center">
      <button
        type="button"
        class="group w-fit cursor-pointer rounded-full p-1 transition-colors duration-300"
        aria-label="Like"
      >
        <HeartIcon class="h-5.5 w-5.5 transition-colors duration-300 group-hover:text-red-500" />
      </button>
      <span class="text-xs">{likeCount}</span>
    </div>
  </div>
  <div>{entry.content} </div>
</div>
```

Usemos este componente dentro del pod del Post.

_src/pods/post/post.pod.astro_

```diff
---
import type { Post } from '#pods/post-collection/post-collection.model';
import Header from '#pods/post/components/header.astro';
+ import Body from '#pods/post/components/body.astro';

// (...)
---

<section class="flex shrink-1 grow flex-col gap-12 px-6 py-4">
  <Header gobackText={postContent.backButton} publishedText={postContent.published} date={postEntry.date} />
+  <Body entry={postEntry} likeCount={likeCount} minReadText={postContent.minRead} />
-  <div>{postEntry.title}</div>
-  <div>{postEntry.content}</div>
</section>
```

Mucho mejor, pero el contenido aún no se está renderizando como HTML.  
Para solucionarlo, podemos usar un contenedor con _Marked_ y _highlight.js_ para renderizar el contenido correctamente, y usarlo dentro del componente **body**.

_src/pods/post/components/body.astro_

```diff
---
import HeartIcon from '#assets/icons/heart.svg';
import type { Post } from '#pods/post-collection/post-collection.model';
+ import MarkdownRenderer from '#components/markdown-renderer.astro';
---
```

```diff
      <span class="text-xs">{likeCount}</span>
    </div>
  </div>
-  <div>{entry.content}</div>
+  <MarkdownRenderer content={entry.content} />
</div>
```

Y… ¡listo! 🎉

```bash
npm run dev
```
