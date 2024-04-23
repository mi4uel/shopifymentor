---
layout: ../../layouts/PostLayout.astro
title: 'Announcement Bar'
pubDate: 2024-04-17
description: "This project is a great all-around test. You'll need good HTML to ensure accessible navigation. There are many tricky CSS details, and the game logic will test your JS."
level: 1
image:
    url: 'https://i.postimg.cc/ncQjW4x3/Websummit.png'
    alt: 'The full Astro logo.'
tags: []
stack: ["html", "css", "javascript", "liquid"]
---

El announcement bar es una herramienta visual muy potente dentre de una tienda virtual, ya que provee información importante para el usuario como descuentos, envios gratis, nuevos productos, etc.

En este articulo te voy a mostrar como crear un announcement bar desde cero para tu tienda de Shopify. Para ello utilizaremos lo siguiente:
Editor de codigo (en mi caso Visual Studio Code)
Html
Css
Javascript
Liquid

Tenemos dos opciones para empezar a modificar el codigo:
Duplicar el theme actual, descargarlo, editarlo y subirlo
Conectar mi theme a una cuenta de github, crear una rama nueva donde escribiremos el codigo, subir los cambios y hacer un pull request

En el caso nro 1, debemos ir al admin->themes, duplicar el theme, descargarlo. Una vez descargado, lo abrimos en nuestro editor de codigo
En el caso nro 2, abrimos nuestra terminal, hacemos git clone y la url de nuestro repositorio, y abrimos la carpeto en nuestro editor de codigo. Una vez realizado esto, abrimos la terminal de VSC, y creamos una nueva rama llamada feature/announcement-bar.
Para crear esta rama necesitamos dos comandos de Git
1 git branch feature/announcement-bar
2 git switch feature/announcement-bar

Para confirmar que estamos en nuestra nueva rama, en la terminal escribimos git branch y deberia retornar nuestra nueva rama

Codigo fuente:
 1 Vamos a crear 3 archivos, el primero 'announcement-bar.liquid' dentro de la carpeta sections, el segundo 'section-announcement-bar.css' y el ultimo 'announcement-bar.js', ambos dentro de la carpeta assets
 
