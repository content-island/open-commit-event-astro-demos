# Collections

What if we want to display a collection of items? That's a React piece of cake. We can use the JavaScript `map` function to transform an array of data into an array of React elements.

Let's change the request to the API so that it returns several pieces of data. In this case, we are going to request 5 pieces of data about dogs.

```diff
---
- const res = await fetch("https://dogapi.dog/api/v2/facts");
+ const res = await fetch("https://dog.ceo/api/breeds/image/random/5
");
const response = await res.json();
-const title = response?.data[0]?.attributes?.body ?? "Ooops api not working?";
+ const data = response?.message ?? [];
+ const imageUrls : string[] = data.map((item: any) => item.attributes.body);
---
```

Y en el markup:

```diff
  <body>
     <h1>{title}</h1>
+    <div>
+      {imageUrls.map((imageUrl : string) => (
+        <img src={imageUrl} alt="Dog Image" />
+      ))}
+    </div>
    <button id="cat-fact-button">Get Cat Fact</button>
    <h2 id="cat-fact"></h2>
  </body>

```
