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

### Input

An example JSON file for `instructions.json`:

```json
{
  "events": [
    {
      "sourceClip": "one.mp4",
      "sourceStart": "00:00:00.0000",
      "sourceDuration": "00:00:07.5000"
    },
    {
      "sourceClip": "one.mp4",
      "sourceStart": "00:00:05.0000",
      "sourceDuration": "00:00:07.5000"
    },
    {
      "sourceClip": "two.mp4",
      "sourceStart": "00:00:18.0000",
      "sourceDuration": "00:00:12.5000"
    },
    {
      "sourceClip": "one.mp4",
      "sourceStart": "00:00:10.0000",
      "sourceDuration": "00:00:07.5000"
    },
    {
      "sourceClip": "one.mp4",
      "sourceStart": "00:00:15.0000",
      "sourceDuration": "00:00:12.5000"
    }
  ]
}

```

This assumes that you have `one.mp4` and `two.mp4` in your current directory.

### Output

This will generate a file named `screencast-output-ffmpeg.tmp.sh`
in your current directory,
which should contain something similar to:

```shell
#!/bin/sh

# slice pieces
ffmpeg -i "one.mp4" -ss "00:00:00.0000" -t "00:00:07.5000" -c copy "screencast-output.01.tmp.mp4"
ffmpeg -i "one.mp4" -ss "00:00:05.0000" -t "00:00:07.5000" -c copy "screencast-output.02.tmp.mp4"
ffmpeg -i "two.mp4" -ss "00:00:18.0000" -t "00:00:12.5000" -c copy "screencast-output.03.tmp.mp4"
ffmpeg -i "one.mp4" -ss "00:00:10.0000" -t "00:00:07.5000" -c copy "screencast-output.04.tmp.mp4"
ffmpeg -i "one.mp4" -ss "00:00:15.0000" -t "00:00:12.5000" -c copy "screencast-output.05.tmp.mp4"

# concatenate pieces
ffmpeg -f concat -safe 0 \
 -i screencast-output-ffmpeg-concat.tmp.txt \
 -c copy ./screencast-output.mp4

# clean up
rm "screencast-output.01.tmp.mp4"
rm "screencast-output.02.tmp.mp4"
rm "screencast-output.03.tmp.mp4"
rm "screencast-output.04.tmp.mp4"
rm "screencast-output.05.tmp.mp4"
rm "screencast-output-ffmpeg-concat.tmp.txt"
rm "screencast-output-ffmpeg.tmp.sh"

```

Run this file:

```shell
./screencast-output-ffmpeg.tmp.sh

```

Which will run various `ffmpeg` commands,
and then clean up after itself
including deleting all the intermediate video clip files.

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
