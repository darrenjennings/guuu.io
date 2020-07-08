---
title: Personal Gifs as a Service
description: How I created my own gif service for free.
date: '2020-07-08T12:48:45.338Z'
layout: Post
tags: [gif, sideprojects, netlify, alfred]
image: https://guuu.s3.amazonaws.com/dgaas.png
---

::: slot header

# {{ this.$page.title }}

:::

<img :src="$page.frontmatter.image" />

I realized that generating random gifs, while wildly amusing, is not very
personal. I also love using emojis 😅 but find them also to not be very
personal. I wanted a way to communicate to my coworkers and friends, but also I
wanted them to be able to see my ridiculously good-looking face 😝

The result:
["darren gifs as a service"](https://github.com/darrenjennings/darren-gifs).

Now I can call upon the internet (like zeus calling for lightening ⚡️) at any
given moment to render a personalized, hand-crafted gif.

Here's a view into what it looks like when invoking the alfred function in
slack:

<KCard border-variant="noBorder" has-hover>
  <template slot="body">
    <div class="d-flex justify-content-center my-4">
      <img src="https://guuu.s3.amazonaws.com/dgaas_yw.gif" />
    </div>
  </template>
</KCard>

## Creating your own gif service

1.  [Create Your Gifs](#create-your-gifs)
1.  [Upload it](#upload-the-gifs-to-a-publicly-accessible-location) to a
    publicly accessible location e.g.
    [GitHub](https://github.com/darrenjennings/darren-gifs)
1.  [Add a Netlify redirect](#add-a-netlify-redirect-to-a-netlify-site) to a
    Netlify site
1.  [Invoke the url](#invoke-the-url) from anywhere

### Create Your Gifs

Gifs can be created with a few services these days. The key is to optimize them
so they're not too big. I use [Giphy Cam](http://www.appstore.com/GiphyCam)
which allows me to easily take gif selfies and add little effects to make them
more fun like text or sparkles.

I then tried to find a service that optimizes them. I found `gifsicle` which
optimizes gifs for space. My face is nice, but does it really need to be 10MB?

```sh
yarn install gifsicle
yarn gifsicle --batch --optimize=200 --colors 256 <gif>.gif
```

### Upload the Gifs to a Publicly Accessible Location

I upload all my gifs to a GitHub repo. The optimization in the previous step is
important here so that you don't store too much... You can easily store these in
any CDN such as [cloudinary](https://cloudinary.com/) or
[S3](https://aws.amazon.com/s3/). The key here is that you want to be able to
remember the name of your gifs so name them short and sweet like **"yw.gif"**
for "you're welcome" or **"no.gif"**, **"yes.gif"**.

Keep the <span class="color-red-400">gif url</span> of your publicly accessible
gifs handy. You will need it in your next step.

<span class="color-red-400">https://raw.githubusercontent.com/darrenjennings/darren-gifs/master/gifs/</span>

### Add a Netlify Redirect to a Netlify Site

Redirects in netlify are dead simple (and free). If you have an existing domain
or Netlify site (did I mention they're free?) then you can add a redirect file
in the root of the deployed site. Grab your <span class="color-red-400">gif
url</span> and put it as the target of your redirect:

`dist/_redirects`

```conf redirects
https://guuu.io/gifs/:name  https://raw.githubusercontent.com/darrenjennings/darren-gifs/master/gifs/:name.gif  301
```

Now I can access a gif on GitHub via a netlify redirect:

[https://guuu.io/gifs/yay](https://guuu.io/gifs/yay)

becomes:

[https://raw.githubusercontent.com/darrenjennings/darren-gifs/master/gifs/yay.gif](https://raw.githubusercontent.com/darrenjennings/darren-gifs/master/gifs/yay.gif)

::: tip Note: 
If your site has a build process, you will need to make sure that
the \_redirects file is in the same directory as your built site, e.g. /dist 
:::

Here's the file on my site for reference:
[guuu.io/\_redirects](https://github.com/darrenjennings/guuu.io/blob/master/_redirects)

### Invoke the URL

I am a big fan of [Alfred](https://www.alfredapp.com/workflows/) after watching
[John Lindquist](https://twitter.com/johnlindquist) stream about Alfred
workflows. I added a small workflow that allows me to type `d <gif_name>` into
my search bar which will paste the url wherever my computer cursor is. This
allows me to react very quickly like the giphy slackbot but it works in any
venue (Discord, Slack, Messages, Texting, etc.). Most everyone has access to the
internet so it works well this way to host my own gifs and the previews even
follow the redirects correctly. I also append a timestamp as a query param
because sometimes slack won't unfurl a link that it's seen before, but I want to
spam my coworkers with my gif even if they've seen it.

I also find that my domain is short enough that I can easily type it out letter
by letter, so even if I don't have an Alfred workflow I can usually call upon
the links from memory.
[https://guuu.io/gifs/beautiful](https://guuu.io/gifs/beautiful)

Check out my GitHub repo to see the source, and all my gifs and a copy of the
alfred workflow

- [https://github.com/darrenjennings/darren-gifs](https://github.com/darrenjennings/darren-gifs)
