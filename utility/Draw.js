/**
 *
 */
function __drawComplexRect( surface, image, p, width, height,
                            ax, ay, awidth, aheight ) {

  if( ! width )
    width = image.width ;
  if( ! height )
    height = image.height ;
  if( ! ax )
    ax = 0 ;
  if( ! ay )
    ay = 0 ;
  if( ! awidth )
    awidth = width ;
  if( ! aheight )
    aheight = height ;

  surface.save( ) ;
  surface.beginPath( ) ;
  surface.moveTo( p[0].x, p[0].y ) ;
  surface.lineTo( p[1].x, p[1].y ) ;
  surface.lineTo( p[3].x, p[3].y ) ;
  surface.lineTo( p[2].x, p[2].y ) ;
  surface.closePath( ) ;
  surface.clip( ) ;

  var t1 = ( p[1].x - p[0].x ) / width ;
  var t2 = ( p[1].y - p[0].y ) / width ;
  var t3 = ( p[2].x - p[0].x ) / height ;
  var t4 = ( p[2].y - p[0].y ) / height ;
  var t5 = p[0].x ;
  var t6 = p[0].y ;
		
  surface.setTransform( t1, t2, t3, t4, t5, t6 ) 
  surface.drawImage( image, ax, ay, awidth, aheight, 0, 0, width, height ) ;
  surface.restore( ) ;

  surface.save( ) ;
  surface.beginPath( ) ;
  surface.moveTo( p[1].x, p[1].y ) ;
  surface.lineTo( p[2].x, p[2].y ) ;
  surface.lineTo( p[3].x, p[3].y ) ;
  surface.closePath( ) ;
  surface.clip( ) ;

  var t1 = ( p[3].x - p[2].x ) / width ;
  var t2 = ( p[3].y - p[2].y ) / width ;
  var t3 = ( p[3].x - p[1].x ) / height ;
  var t4 = ( p[3].y - p[1].y ) / height ;
  var t5 = p[2].x ;
  var t6 = p[2].y ;
		
  surface.setTransform( t1, t2, t3, t4, t5, t6 ) 
  surface.drawImage( image, ax, ay, awidth, aheight, 0, 0, width, -height ) ;
  surface.restore( ) ;
}


function __toBase64Pdf( image ) {
  var canvas = document.createElement( 'canvas' ) ;
  var context = canvas.getContext( '2d' ) ;
  context.drawImage( image, 0, 0 ) ;
  return canvas.toDataURL( 'image/png' ) ;
}
