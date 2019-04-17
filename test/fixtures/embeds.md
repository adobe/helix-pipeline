# Hello "World"

## Gatsby-Style-Embeds

`video: https://www.youtube.com/embed/2Xc9gXyf2G4`

is an embed, but

`this` is simple inline code and `video: www.youtube.com` isn't an embed either.

`video:    http foo bar` looks interesting, but doesn't work either.

## Link + Image-Style Embeds

[![Audi R8](http://img.youtube.com/vi/KOxbO0EI4MA/0.jpg)](https://www.youtube.com/watch?v=KOxbO0EI4MA "Audi R8")

is an embed, but [this](https://www.youtube.com/watch?v=KOxbO0EI4MA "Audi R8") is just a link and ![Audi R8](http://img.youtube.com/vi/KOxbO0EI4MA/0.jpg) is just an image.

## Image-Style Embeds

![](https://www.youtube.com/watch?v=KOxbO0EI4MA)

is an embed, but 

![](https://www.gstatic.com/youtube/img/promos/growth/b74c9f83bf1704acff7677e46adde6cf59f23f4be85261468c1b1c7fa992ec18_120x120.jpeg) is just an image. Even when 

![](https://www.gstatic.com/youtube/img/promos/growth/b74c9f83bf1704acff7677e46adde6cf59f23f4be85261468c1b1c7fa992ec18_120x120.jpeg)

is on a paragraph of its own.

## IA Writer-Style Embeds

https://www.youtube.com/watch?v=KOxbO0EI4MA

is an embed, but https://www.youtube.com/watch?v=KOxbO0EI4MA is just a link.

# Whitelisting

All embed hostnames must be whitelisted. Therefore, the following are not embeds:

`video: https://www.example.com/embed/2Xc9gXyf2G4`

[![Audi R8](http://img.youtube.com/vi/KOxbO0EI4MA/0.jpg)](https://www.example.com/watch?v=KOxbO0EI4MA "Audi R8")

![](https://www.example.com/watch?v=KOxbO0EI4MA)

https://www.example.com/watch?v=KOxbO0EI4MA

# Internal Embeds

## Gatsby-Style-Embeds

`embed: foo.md`

`html: bar.html`

`markdowm: /docs/test.md`

`embed:../index.html`

Are all valid embeds, but `test: foo.md` isn't one.


## Image-Style Embeds

![](foo.md)

is an embed, but 

![](foo.png) is just an image. Even when 

![](foo.png)

is on a paragraph of its own.

## IA Writer-Style Embeds

/foo.md

../foo.html

../readme/docs.html

Are all valid embeds, but

/foo.txt

isn't one.