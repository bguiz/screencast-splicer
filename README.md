# `screencast-splicer`

Cuts several recorded videos into pieces
and joins them together again.

A tool created to scratch my own itch:
This intended for use in screencast post-processing.

## Usage

Ensure that you have `ffmpeg` version 4.2.2 or later
installed on your system.

```shell
npx screencast-splicer instructions.json screencast.mp4

```

## Caveats

- There is an issue with `ffmpeg` in which
  the seek start and stop times are not exact,
  so clips can start slightly later than they are meant to,
  or end slightly earlier than they are supposed to.
  Sometimes this affects audio and video channels separately.
  This is more of an issue when joining multiple short clips,
  and not so much with longer clips.
  - **Suggestions** for improving this are **very welcome**!
- The all of the input files and the output files should
  have the same audio and video codecs, resolution, and sample rates.
  This is inherent from the use of the `-c copy` option on `ffmpeg`
  and is intended avoid transcoding to deliver speedier results.

## Author

[Brendan Graetz](http://bguiz.com/)

## Licence

GPL-3.0
