import jwt from 'jsonwebtoken';
import 'dotenv/config';

/**
 * Classe que possui métodos úteis para a manipulação de tokens JWT.
 */
export class JwtHandler {
  /**
   * Gera um token JWT com o payload fornecido.
   *  @param {Object} payload - O conteúdo a ser incluído no token.
   *  @param {Object} [options={}] - Opções adicionais para a criação do token.
   *  @returns {Promise<string>} - Retorna token JWT.
   */
  signToken(payload: any, options?: object): string {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, options);
  }

  /**
   * Verifica a validade de um token JWT.
   *
   * @param {string} token - O token JWT a ser verificado.
   * @param {function} callback - Função de retorno chamada após a verificação. Recebe dois parâmetros: (err, decoded).
   *                             - Se o token for inválido, err conterá informações sobre o erro. Caso contrário, err será null e decoded conterá o payload do token decodificado.
   */
  verifyToken(token: string, callback?: any): void {
    jwt.verify(token, process.env.JWT_SECRET_KEY, callback);
  }
}
