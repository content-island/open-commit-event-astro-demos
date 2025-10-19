# Fences

We take as starting point the previous 00-boilerplate demo, just copy that project into a clean folder and execute `npm install` and then `npm run dev`.

Let’s dive into Astro components. If you take a look, they’re a bit like Vue — you’ve got code, HTML, and styles all in the same file.

Let’s try something out: we’ll change the _h1_ of the homepage with text defined in a variable.

_./src/pages/index.astro_

```diff
---
+ const title = "Hello React Alicante";
---

<html lang="en">
	<head>
		<meta charset="utf-8" />
		<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
		<meta name="viewport" content="width=device-width" />
		<meta name="generator" content={Astro.generator} />
		<title>Astro</title>

	</head>
	<body>
-		<h1>Astro</h1>
+    <h1>{title}</h1>
```

> Binding works exactly the same as in React — we use curly braces to indicate a variable.

If we run it, we’ll see the new title.

```bash
npm run dev
```

And now you may be wondering: what are _Fences_?

They’re code blocks that run on the server. If we’re in SSG mode, they only run once — when the site is generated.

Let’s see it more clearly: we’ll fetch a random value from an API and display it on the page.

For example, there’s a public API that returns a dog fact. Let’s use it.

_./src/pages/index.astro_

```diff
---
+ const res = await fetch("https://dogapi.dog/api/v2/facts");
+ const response = await res.json();
+ const title = response?.data[0]?.attributes?.body ?? "Ooops api not working?";
- const title = "Hello React Alicante";
---
```

Let’s check the result in the browser — we should see a random dog fact.

If we make a build and look at the generated files in _./dist/index.html_, we’ll see the dog fact already there, because it was fetched at build time.

```bash
npm run build
```

> If we’re in SSR mode, this code will run on every server request. It never runs in the browser.

But can we run code in the browser? Of course! You can, even you can use use React, Vue, or Svelte for that.

Let’s do a plain vanilla simple example: we’ll add a button that fetches and displays a cat fact. The button will be called **“Get Cat Fact”**.

_./src/pages/index.astro_

```diff
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
		<meta name="viewport" content="width=device-width" />
		<meta name="generator" content={Astro.generator} />
		<title>Astro</title>
	</head>
	<body>
		<h1>{title}</h1>
+		<button id="cat-fact-button">Get Cat Fact</button>
+		<h2 id="cat-fact"></h2>
	</body>
</html>

+ <script>
+ const button = document.getElementById("cat-fact-button");
+ const factEl = document.getElementById("cat-fact");
+
+ if (button && factEl) {
+  button.addEventListener("click", async () => {
+    const res = await fetch("https://catfact.ninja/fact");
+    const data = await res.json();
+    factEl.innerText = data.fact;
+  });
+}
+ </script>
```

If we run it, we’ll see that clicking the button displays a cat fact.

```bash
npm run dev
```

Now you might wonder: how can I debug this?

Let’s see how to debug code inside fences and browser code.

To debug **fence code**:

- Place a breakpoint inside the fence code.
- Open a terminal in **JavaScript Debug Terminal** mode and run:

```bash
npm run dev
```

When you run the server, it will stop at the breakpoint and you can debug.

Important: in local development mode, every time you reload the page the fence code will run again. But this only happens in dev mode — in production it runs once, at build time.

And how do we debug **browser code**? Just like always — with the browser’s DevTools.

**Bonus** You can extract this to a _ts_ file but you will need to tweak the code a bit:

_./src/pages/cat.ts_

```ts
async function getCatFact() {
  const res = await fetch("https://catfact.ninja/fact");
  const data = await res.json();
  return data.fact;
}

export const setupCatFactButton = () => {
  const button = document.getElementById("cat-fact-button");
  const factEl = document.getElementById("cat-fact");

  if (button && factEl) {
    button.addEventListener("click", async () => {
      const fact = await getCatFact();
      factEl.innerText = fact;
    });
  }
};
```

_./src/pages/index.astro_

```diff
// (...)

<script>
+ import { setupCatFactButton } from "./cat";
+ setupCatFactButton();
-  const button = document.getElementById("cat-fact-button");
-  const factEl = document.getElementById("cat-fact");
-
-  if (button && factEl) {
-    button.addEventListener("click", async () => {
-      const res = await fetch("https://catfact.ninja/fact");
-      const data = await res.json();
-      factEl.innerText = data.fact;
-    });
-  }
</script>

```
