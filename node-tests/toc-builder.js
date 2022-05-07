const { expect } = require('chai');
const { createBuilder, createTempDir } = require('broccoli-test-helper');

const TocBuilder = require('../lib/toc-builder');

let output;
let input;

async function buildFiles(files) {
  input.write({
    content: files,
  });

  const subject = new TocBuilder(`${input.path()}`);
  output = createBuilder(subject);

  await output.build();

  return output.read();
}

describe('Tag Generator', function () {
  beforeEach(async () => {
    input = await createTempDir();
  });

  afterEach(async () => {
    try {
      await input.dispose();
    } finally {
      // do nothing
    }

    if (output) {
      await output.dispose();
    }
  });

  it('should automatically create a new tag for the most recent 4 posts', async function () {
    const files = await buildFiles({
      'index.json': `{
        "data": {
          "id": "0001-transform",
          "attributes": {
            "startDate": "2001"
          },
          "relationships": {
            "stage": {
              "data": {
                "id": "accepted"
              }
            }
          }
        }
      }`,
      'index2.json': `{
        "data": {
          "id": "0002-attribute",
          "attributes": {
            "startDate": "2001"
          },
          "relationships": {
            "stage": {
              "data": {
                "id": "accepted"
              }
            }
          }
        }
      }`,
      'index3.json': `{
        "data": {
          "id": "0005-meta",
          "attributes": {
            "startDate": "2001"
          },
          "relationships": {
            "stage": {
              "data": {
                "id": "rejected"
              }
            }
          }
        }
      }`,
      'index4.json': `{
        "data": {
          "id": "0011-parameter",
          "attributes": {
            "startDate": "2001"
          },
          "relationships": {
            "stage": {
              "data": {
                "id": "approved"
              }
            }
          }
        }
      }`,
      'index5.md': `---
tags:
  - a-tag-of-sorts
authors:
  - ghost
date: Tue Jun 13 2018 17:50:59 GMT+0100 (IST)
---
# Hello world`,
    });

    // first file has new tag
    expect(JSON.parse(files.tocs['content.json'])).to.deep.equal({
      data: {
        type: 'tocs',
        id: 'content',
        attributes: {
          links: [
            '0001-transform',
            '0002-attribute',
            '0005-meta',
            '0011-parameter',
          ],
          stages: ['accepted', 'approved', 'rejected'],
          stageLinks: {
            approved: ['0011-parameter'],
            rejected: ['0005-meta'],
            accepted: ['0001-transform', '0002-attribute'],
          },
        },
      },
    });
  });
});
