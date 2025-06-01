[source](https://modernwebweekly.substack.com/p/modern-web-weekly-52)

Here’s an interesting issue I ran into last week while trying to improve an old view transitions demo.

The demo shows how you can use view transitions when moving items from a “todo” list to a “doing” and “done” list. Here’s what it looks like:

I happened to notice that the item that was moved was actually moving _behind_ the lists, which is not what I wanted:

[

![](https://substackcdn.com/image/fetch/w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fb6740ce3-2c09-4188-8197-d2838218e34d_764x297.heic)



](https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fb6740ce3-2c09-4188-8197-d2838218e34d_764x297.heic)

The moved list item goes behind the lists

Since this was an issue I had run into before, I knew the solution was to simply add a higher `z-index` to the moved item. The simplest way to do that is to add a `class` to the moved item that gives it `z-index: 1` and then remove it when the transition is finished:

```
li.classList.add('active');

const transition =  document.startViewTransition(move);
await transition.finished;

li.classList.remove('active');
```

But to my surprise, this didn’t work because the `<li>` element had `position: static`.

[

![](https://substackcdn.com/image/fetch/w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F610818a5-9501-46bb-bbb7-a0aad809e172_364x241.heic)



](https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F610818a5-9501-46bb-bbb7-a0aad809e172_364x241.heic)

z-index doesn’t work on elements with position: static

Now I’m aware that setting a `z-index` on an element with `position: static` has no effect, but I was surprised because I applied this fix before, and it always seemed to work while I was sure I never had to apply a value for `position` other than `static`.

I checked some of my other demos and noticed that the only difference with elements where this fix worked was that they had `display: flex`.

It turns out that flex elements create a stacking context when given a `z-index` with a value other than `auto`, even when they have `position: static`. Grid elements have this same behavior. I wasn’t even aware of this, but it always worked for me since I use Flexbox a lot.

When you create animations with view transitions, you will regularly have to modify the stacking order of elements to make them move in front of or behind each other, so always use Flexbox or Grid so you can apply a `z-index`.

In my case, I had to set display: flex and flex-direction: column on the parent <ul> element to make sure the items were still displayed vertically.

If you’re interested, this behavior is mentioned in the [Flexbox specs](https://www.w3.org/TR/css-flexbox-1/#painting) and [Grid layout specs](https://www.w3.org/TR/css-grid-1/#z-order).

Check the [codepen demo](https://codepen.io/dannymoerkerke/pen/ExMEPaW).