const { join } = require('path')
const KeyStore = require('./key-store')
const isCloaked = require('./lib/is-cloaked-msg-id')

module.exports = {
  name: 'private2',
  version: require('./package.json').version,
  manifest: {
    group: {
      add: 'async',
      addAuthors: 'async',
      // removeAuthors: 'async'
      // create: 'async',
    },
    author: {
      keys: 'async' // should this even be public?
      // invite: 'async',
    }
  },
  init: (ssb, config) => {
    const keystore = KeyStore(join(config.path, 'private2/keystore'))
    ssb.close.hook(function (fn, args) {
      keystore.close()
      return fn.apply(this, args)
    })

    /* register the boxer / unboxer */
    ssb.addBoxer((content, recps) => {
      if (!recps.every(isCloaked)) return null
      // TODO accept (cloaked | feedId)

      // look up / derive recp_keys

      return 'doop.box2'
    })
    ssb.addUnboxer({
      init: function (done) {
        done()
      },
      key: function unboxKey (ciphertext, value) {
        if (!ciphertext.endsWith('.box2')) return null
        // change stuff into buffers,
        // load up the trial keys
        // try and access the msg_key
        return
      },
      value: function unboxBody (ciphertext, msg_key) {
        // get the body
        return {
          type: 'doop',
          text: 'your order here!'
        }
      }
    })


    // listen for new key-entrust messages
    //   - use a dummy flume-view to tap into unseen messages
    //   - discovering new keys triggers re-indexes of other views

    return {
      group: {
        add: keystore.group.add,
        addAuthors (groupId, authorIds, cb) {
          pull(
            pull.values(authorIds),
            pull.asyncMap((authorId, cb) => keystore.addAuthor(groupId, authorId, cb)),
            pull.collect((err) => {
              if (err) cb(err)
              else cb(null, true)
            })
          )
        },
        // create
        // remove
        // removeAuthors
      },
      author: {
        keys: keystore.author.keys,
        // invite
      }
    }
  }
}

// TODO:
// - design key-entrust messages
//   - see if box2 can support feedId + groupId type messages
// - figure out how to programmatically trigger re-indexing
//
// TODO (later):
// - design group creation (later)