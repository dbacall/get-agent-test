const Router = require('@koa/router');
const router = new Router();

const lrProperty = require('./models/lrProperty.js');

router.prefix('/lrProperty');

router
  .param('lrPropertyId', async (id, ctx, next) => {
    ctx.lrProperty = await new lrProperty({ id }).fetch({
      withRelated: ['lrTransactions'],
      require: false,
    });

    if (!ctx.lrProperty) {
      ctx.status = 404;
      return (ctx.body = { error: true, msg: 'LRProperty not found' });
    }

    return next();
  })
  .get('/:lrPropertyId', async (ctx, next) => {
    return (ctx.body = { success: true, lrProperty: ctx.lrProperty.toJSON() });
  });

router
  .param('lrPropertyStreet', async (street, ctx, next) => {
    ctx.lrProperties = await new lrProperty()
      .where({ street })
      .fetchAll({ withRelated: ['lrTransactions'], require: false });

    if (ctx.lrProperties.length === 0) {
      ctx.status = 404;
      return (ctx.body = { error: true, msg: 'LRProperties not found' });
    }

    return next();
  })
  .get('/street/:lrPropertyStreet', async (ctx, next) => {
    return (ctx.body = {
      success: true,
      lrProperty: ctx.lrProperties.toJSON(),
    });
  });

router
  .param('lrPropertyOutcode', async (outcode, ctx, next) => {
    ctx.lrProperties = await new lrProperty()
      .where({ outcode })
      .fetchAll({ withRelated: ['lrTransactions'], require: false });

    if (ctx.lrProperties.length === 0) {
      ctx.status = 404;
      return (ctx.body = { error: true, msg: 'LRProperties not found' });
    }

    return next();
  })
  .get('/outcode/:lrPropertyOutcode', async (ctx, next) => {
    return (ctx.body = {
      success: true,
      lrProperty: ctx.lrProperties.toJSON(),
    });
  });

module.exports = (app) => {
  app.use(router.routes()).use(router.allowedMethods());
};
