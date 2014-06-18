PlayCanvas went open source last week so this is me experimenting with it. As always, I'd love to make some kind of Elite clone so I hope to head in that direction.



Here's a nice looking way to generate a planet:
http://freespace.virgin.net/hugo.elias/models/m_landsp.htm
It's good from a distance but close up, you don't want to be running the
process for the whole planet.

http://www.gamasutra.com/view/feature/131507/a_realtime_procedural_universe_.php
Dynamic algorithms - add detail as needed.
I need to use something like perlin noise and generate meshes on the fly.

I need to be able to request the mesh for a given area of a planet at a given
level of detail.

I don't want to use cartesian coords as that generates more points at the poles when mapped onto a sphere.




NOISE

This is simple and works right away -
https://github.com/josephg/noisejs

This is a noise-generating shader for WebGL. Probably faster but more complex.
https://github.com/ashima/webgl-noise