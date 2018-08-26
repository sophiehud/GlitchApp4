'use strict';

const uuid = require('uuid');
const logger = require('../utils/logger');
const bookmarkStore = require('../models/bookmark-store');
const accounts = require('./accounts.js');
const pictureStore = require('../models/picture-store.js');


const menu = {
  index(request, response) {
    logger.info('Menu rendering');
    const loggedInUser = accounts.getCurrentprofile(request);
    const viewData = {
      title: 'bookmark Menu', 
      title: 'PictureStore Menu',
      user: loggedInUser,
      album: pictureStore.getAlbum(loggedInUser.id),
      bookmarks: bookmarkStore.getAllbookmarks(),
    };
    logger.info('about to render', bookmarkStore.getAllbookmarks());
    response.render('menu', viewData);
  },
  
   uploadPicture(request, response) {
    const loggedInUser = accounts.getCurrentprofile(request);
    pictureStore.addPicture(loggedInUser.id, request.body.title, request.files.picture, function () {
      response.redirect('/menu');
    });
  },


  deletebookmark(request, response) {
    const bookmarkId = request.params.id;
    logger.debug(`Deleting bookmark ${bookmarkId}`);
    bookmarkStore.removebookmark(bookmarkId);
    response.redirect('/menu');
  },

  addbookmark(request, response) {
    const newbookmark = {
      id: uuid(),
      title: request.body.title,
      links: [],
    };
    logger.debug('Creating a new bookmark', newbookmark);
    bookmarkStore.addbookmark(newbookmark);
    response.redirect('/menu');
  },
};

module.exports = menu;
