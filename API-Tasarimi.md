openapi: 3.1.0
info:
  title: RICH Alısveriş API
  description: |
    E-ticaret platformu için RESTful API.
    
    ## Özellikler
    - Kullanıcı yönetimi(kayıt,giriş,çıkış,hesap silme)
    - Ürün katalog yönetimi(kategori,beden,renk,stok,fiyat sıralama)
    -Favoriler yönetimi
    -Sepet yönetimi
    -Ödeme işlemleri
    -Adres Yönetimi
    - JWT tabanlı kimlik doğrulama
  version: 1.0.0
  contact:
    name: API Destek Ekibi
    email: api-support@rich.com
    url: https://api.rich.com/support
  license:
    name: MIT
    url: https://opensource.org/licenses/MIT

servers:
  - url: https://rich-api.com/v1
    description: Production server
  - url: https://staging-api.yazmuh.com/v1
    description: Staging server
  - url: http://localhost:3000/v1
    description: Development server

tags:
  - name: users
    description: Kullanıcı işlemleri
  - name: auth
    description: Kimlik doğrulama
  - name: products
    description: Ürün işlemleri
  - name: favorites
    description: Favoriler işlemleri
  - name: cart
    description: Sepet işlemleri
  - name: orders
    description: Sipariş ve ödeme işlemleri
  - name: addresses
    description: Adres yönetimi

paths:
  /auth/register:
    post:
      tags:
        - auth
      summary: Kullanıcı kaydı
      description: Sisteme yeni bir kullanıcı kaydeder
      operationId: registerUser
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UserRegistration'
            examples:
              example1:
                summary: Örnek kullanıcı kaydı
                value:
                  email: kullanici@example.com
                  password: Guvenli123!
                  firstName: Ahmet
                  lastName: Yılmaz
      responses:
        '201':
          description: Kullanıcı başarıyla oluşturuldu
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '400':
          $ref: '#/components/responses/BadRequest'
        '409':
          description: Email adresi zaten kullanımda
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /auth/login:
    post:
      tags:
        - auth
      summary: Kullanıcı girişi
      description: Email ve şifre ile giriş yapar
      operationId: loginUser
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/LoginCredentials'
      responses:
        '200':
          description: Giriş başarılı
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AuthToken'
        '401':
          $ref: '#/components/responses/Unauthorized'

  /auth/logout:
    post:
      tags:
        - auth
      summary: Çıkış yap
      description: Kullanıcının oturumunu sonlandırır
      operationId: logoutUser
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Çıkış başarılı        


  /users/{userId}:
    delete:
      tags:
        - users
      summary: Hesap silme
      description: Kullanıcı hesabını siler
      operationId: deleteUser
      security:
        - bearerAuth: []
      parameters:
        - $ref: '#/components/parameters/UserIdParam'
      responses:
        '204':
          description: Kullanıcı başarıyla silindi
        '401':
          $ref: '#/components/responses/Unauthorized'
        '403':
          $ref: '#/components/responses/Forbidden'
        '404':
          $ref: '#/components/responses/NotFound'

    /products:
    get:
      tags:
        - products
      summary: Ürün listesi
      description: Ürünleri kategori, fiyat ve stok bilgisine göre listeler
      operationId: listProducts
      parameters:
        - $ref: '#/components/parameters/PageParam'
        - $ref: '#/components/parameters/LimitParam'
        - name: category
          in: query
          description: Kategoriye göre filtrele
          schema:
            type: string
            enum: [kadin, erkek, bebek, aksesuar]
        - name: minPrice
          in: query
          description: Minimum fiyat
          schema:
            type: number
        - name: maxPrice
          in: query
          description: Maksimum fiyat
          schema:
            type: number
        - name: color
          in: query
          description: Ürün rengine göre filtrele
          schema:
            type: string
        - name: size
          in: query
          description: Ürün bedenine göre filtrele
          schema:
            type: string
        - name: sortByPrice
          in: query
          description: Fiyata göre sıralama (asc/desc)
          schema:
            type: string
            enum: [asc, desc]
      responses:
        '200':
          description: Başarılı
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProductList'

    /favorites:
    post:
      tags:
        - favorites
      summary: Favorilere ürün ekle
      description: Kullanıcının ürününü favorilere ekler
      operationId: addFavorite
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/FavoriteCreate'
      responses:
        '201':
          description: Ürün favorilere eklendi
        '400':
          $ref: '#/components/responses/BadRequest'

    get:
      tags:
        - favorites
      summary: Favori ürünleri listele
      description: Kullanıcının favori ürünlerini listeler
      operationId: listFavorites
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Başarılı
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProductList'

    /favorites/{productId}:
    delete:
      tags:
        - favorites
      summary: Favoriden ürün sil
      description: Kullanıcının favorilerinden ürün siler
      operationId: deleteFavorite
      security:
        - bearerAuth: []
      parameters:
        - $ref: '#/components/parameters/ProductIdParam'
      responses:
        '204':
          description: Ürün favorilerden silindi

    /cart:
    get:
      tags:
        - cart
      summary: Sepeti görüntüle
      description: Kullanıcının sepetini listeler
      operationId: viewCart
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Başarılı
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Cart'



    post:
      tags:
        - cart
      summary: Sepete ürün ekle
      description: Kullanıcı ürünü sepete ekler
      operationId: addCartItem
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CartItemCreate'
      responses:
        '201':
          description: Ürün sepete eklendi

    delete:
      tags:
        - cart
      summary: Sepetten ürün sil
      description: Kullanıcı sepetteki ürünü kaldırır
      operationId: removeCartItem
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CartItemDelete'
      responses:
        '204':
          description: Ürün sepetten silindi

    /orders:
    post:
      tags:
        - orders
      summary: Ödeme ve sipariş oluşturma
      description: Kullanıcının sepetindeki ürünlerle sipariş oluşturmasını sağlar
      operationId: createOrder
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/OrderCreate'
      responses:
        '201':
          description: Sipariş oluşturuldu
        '400':
          $ref: '#/components/responses/BadRequest' 


                                       



    


components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: JWT token ile kimlik doğrulama

  parameters:
    UserIdParam:
      name: userId
      in: path
      required: true
      description: Kullanıcı ID
      schema:
        type: string
        format: uuid
    
    ProductIdParam:
      name: productId
      in: path
      required: true
      description: Ürün ID
      schema:
        type: string
        format: uuid
    
    PageParam:
      name: page
      in: query
      description: Sayfa numarası
      schema:
        type: integer
        minimum: 1
        default: 1
    
    LimitParam:
      name: limit
      in: query
      description: Sayfa başına kayıt sayısı
      schema:
        type: integer
        minimum: 1
        maximum: 100
        default: 20

  schemas:
    User:
      type: object
      required:
        - id
        - email
        - firstName
        - lastName
        - createdAt
      properties:
        id:
          type: string
          format: uuid
        email:
          type: string
        firstName:
          type: string
        lastName:
          type: string
        createdAt:
          type: string
          format: date-time
        phone:
          type: string

    UserRegistration:
      type: object
      required:
        - email
        - password
        - firstName
        - lastName
      properties:
        email:
          type: string
        password:
          type: string
        firstName:
          type: string
        lastName:
          type: string

    LoginCredentials:
      type: object
      required: [email, password]
      properties:
        email:
          type: string
        password:
          type: string
    
    Product:
      type: object
      required: [id, name, price, category]
      properties:
        id:
          type: string
        name:
          type: string
        price:
          type: number
        category:
          type: string
        description:
          type: string
        stock:
          type: integer
        imageUrl:
          type: string
        size:
          type: string
        color:
          type: string

    ProductList:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/Product'
        pagination:
          $ref: '#/components/schemas/Pagination' 

    FavoriteCreate:
      type: object
      required: [productId]
      properties:
        productId:
          type: string

    Cart:
      type: object
      properties:
        items:
          type: array
          items:
            $ref: '#/components/schemas/CartItem'
        totalAmount:
          type: number

    CartItem:
      type: object
      properties:
        productId:
          type: string
        name:
          type: string
        price:
          type: number
        quantity:
          type: integer

    CartItemCreate:
      type: object
      required: [productId, quantity]
      properties:
        productId:
          type: string
        quantity:
          type: integer

    CartItemDelete:
      type: object
      required: [productId]
      properties:
        productId:
          type: string

    OrderCreate:
      type: object
      required: [items, shippingAddress]
      properties:
        items:
          type: array
          minItems: 1
          items:
            $ref: '#/components/schemas/CartItem'
        shippingAddress:
          $ref: '#/components/schemas/Address'

    Address:
      type: object
      required: [street, city, postalCode, country]
      properties:
        street:
          type: string
        city:
          type: string
        postalCode:
          type: string
        country:
          type: string

    OrderList:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/OrderCreate'
        pagination:
          $ref: '#/components/schemas/Pagination'

    Pagination:
      type: object
      properties:
        page:
          type: integer
        limit:
          type: integer
        totalPages:
          type: integer
        totalItems:
          type: integer 

    Error:
      type: object
      required: [code, message]
      properties:
        code:
          type: string
        message:
          type: string

    responses:
      BadRequest:
        description: Geçersiz istek
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Error'   

    Unauthorized:
      description: Yetkisiz erişim
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
    NotFound:
      description: Kaynak bulunamadı
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
    Forbidden:
      description: Erişim reddedildi
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'




   

``