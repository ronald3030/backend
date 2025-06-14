// src/services/user.service.ts
import db from '../config/database'; // Nuestra instancia de Knex
import { DBUser } from '../types/custom'; // Los tipos que definimos anteriormente

export class UserService {
  /**
   * Busca un usuario por su nombre de usuario y une la tabla Roles para obtener el nombre del rol.
   * Esta función es esencial para el proceso de login.
   * @param nombre_usuario El nombre del usuario a buscar.
   * @returns El objeto de usuario incluyendo el hash de la contraseña, o null si no se encuentra.
   */
  public async findByUsername(nombre_usuario: string): Promise<DBUser | null> {
    // La anotación <DBUser> le dice a Knex qué tipo de objeto esperamos recibir.
    const user = await db<DBUser>('Usuarios')
      .select(
        'Usuarios.id',
        'Usuarios.nombre_usuario',
        'Usuarios.password_hash', // Se necesita para comparar la contraseña en el login
        'Usuarios.rol_id',
        'Usuarios.sucursal_id',
        'Usuarios.activo',
        'Roles.nombre_rol' // Incluimos el nombre del rol desde la tabla Roles
      )
      .leftJoin('Roles', 'Usuarios.rol_id', 'Roles.id') // Hacemos un JOIN con la tabla Roles
      .where('Usuarios.nombre_usuario', nombre_usuario)
      .first(); // .first() busca el primer registro que coincida y devuelve un solo objeto o undefined

    // Si 'user' es undefined, retornamos null. De lo contrario, retornamos el objeto de usuario.
    return user || null;
  }

  /**
   * Busca un usuario por su ID. Útil para verificar la autenticación en cada petición
   * y para obtener datos del usuario sin exponer el hash de la contraseña.
   * @param id El ID del usuario.
   * @returns El objeto de usuario (sin el hash de la contraseña) o null.
   */
  public async findById(id: number): Promise<Omit<DBUser, 'password_hash'> | null> {
    const user = await db<DBUser>('Usuarios')
      .select(
        'Usuarios.id',
        'Usuarios.nombre_usuario',
        'Usuarios.rol_id',
        'Usuarios.sucursal_id',
        'Usuarios.activo',
        'Roles.nombre_rol'
        // Notar que deliberadamente no seleccionamos 'password_hash' aquí
      )
      .leftJoin('Roles', 'Usuarios.rol_id', 'Roles.id')
      .where('Usuarios.id', id)
      .first();

    return user || null;
  }

  // En el futuro, aquí podrías añadir más métodos útiles, como:
  //
  // public async createUser(userData: Omit<Usuario, 'id' | 'fecha_creacion' | 'ultima_modificacion'>): Promise<DBUser> {
  //   // Lógica para hashear la contraseña y crear un nuevo usuario
  // }
  //
  // public async updateUser(id: number, updatedData: Partial<Usuario>): Promise<DBUser | null> {
  //   // Lógica para actualizar datos de un usuario
  // }
  //
  // public async findAllUsers(): Promise<Omit<DBUser, 'password_hash'>[]> {
  //   // Lógica para listar todos los usuarios del sistema (para el panel de Admin)
  // }
}