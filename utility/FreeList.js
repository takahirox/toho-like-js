/**
 * This class manages object resources to reduce GC.
 */
function FreeList( num ) {
  this.num = num ;
  this.head = null ;
  this.tail = null ;
  this.list = [ ] ;
  this._init( ) ;
}


FreeList.prototype._init = function( ) {
  // Just in case.
  if( this.num <= 0 )
    return ;
  for( var i = 0; i < this.num; i++ ) {
    var element = this._generateElement( ) ;
    element.listId = i ;
    this.list.push( { 'element': element, 'listForw': null, 'available': true } ) ;
    if( i > 0 )
      this.list[ i - 1 ].listForw = this.list[ i ] ;
  }
  this.head = this.list[ 0 ] ;
  this.tail = this.list[ this.num - 1 ] ;
} ;


/**
 * Child class must override this method.
 */
FreeList.prototype._generateElement = function( ) {
  return { } ;
} ;


/**
 * TODO: must implement the object shortage handler.
 * TODO: verify the functionality.
 */
FreeList.prototype.get = function( ) {
  if( this.head == null ) {
    window.alert( 'ran out of object resources.' ) ;
    console.log(this);
    throw new Error( 'ran out of object resources.' ) ;
  }
  var head = this.head ;
  this.head = head.listForw ;
  head.available = false ;
  head.listForw = null ;
  if( this.head == null )
    this.tail = null ;
  return head.element ;
} ;


FreeList.prototype.free = function( element ) {
  this.list[ element.listId ].available = true ;
  if( this.tail != null )
    this.tail.listForw = this.list[ element.listId ] ;
  this.tail = this.list[ element.listId ] ;
  if( this.head == null )
    this.head = this.tail ;
} ;

