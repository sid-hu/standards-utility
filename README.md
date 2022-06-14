## standards-utility

***a digital version of Oclef's standards matrix.***

### running it locally

1. install dependencies with `npm install`
1. build protos with `make protobuf`
1. get the measure detection [model](https://github.com/sid-hu/measure-detection/releases/download/v0.1.0/web_model_uint8.zip), unzip it, and put it in `public/models/`
1. run it with `make start`

### the concept

- an interactive practice application between instructors and students.
- atomization of practice behavior (to be able to collect lots of data on how people practice more specifically)
- instructors guided by AI fed by practice data (similar to how a doctor treats a patient)

### features to be implemented

- accessibility + mobile / touch support
  - [ ] responsive layouts
  - [x] drag & drop
  - [ ] eliminate hover states
  - [ ] sane tab / focus
  - [x] address the chromium double backdrop filter bug
- practice improvements
  - [x] add "x in a row" feature
  - [x] add calculated completion value
- section layers
  - [ ] select active layer, this will be the one with the most pronounced GUI
  - [ ] other layers will exhibit a transparent "ghost" against the current layer, they will be tinted the color of the layer they belong to.
- organizations
  - [ ] the organization can have an index of pieces, which can be fetched from it's server
  - [ ] represents an external "organization" like a school or a teacher
  - [ ] the organization can "assign" sections in a specific layer, modifications to those sections will be tracked and sent to the organization's server
  - [ ] the organization can "assign" pieces, these will be downloaded and added at the confirmation of the user
- annotation system
  - [ ] use extra bounding boxes to define "symbols", these can be chords, rests, staff text etc...
  - [ ] these "symbols" can come with descriptions which will be rendered on the client's screen
  - [ ] create a common format for the storage and transmission of annotations, sections, piece metadata and piece content
- meter system
  - [ ] add a built in metronome
  - [ ] add tempo and meter to the piece metadata
  - [ ] (optional) a "recording" mode, where a cursor will go through the entire piece and automatically flip pages for you, it will record your play through. you can then "playback" your play through and mark all places where you wish to improve and it will store it as such and remind you next time you practice.
