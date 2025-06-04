import {
    IToken,
    ITokenModel,
    ITokenModelWithDoctor,
} from "../interfaces/token.interface";
import { Token } from "../models/token.model";

class TokenRepository {
    public create(
        tokenModel: ITokenModel | ITokenModelWithDoctor,
    ): Promise<IToken> {
        const hasUserId = "_userId" in tokenModel;
        const hasDoctorId = "_doctorId" in tokenModel;

        if (!hasUserId && !hasDoctorId) {
            throw new Error("Either _userId or _doctorId must be provided");
        }

        return Token.create(tokenModel);
    }

    public findByParams(params: Partial<IToken>): Promise<IToken> {
        return Token.findOne(params);
    }
    public async deleteBeforeDate(date: Date): Promise<number> {
        const result = await Token.deleteMany({ createdAt: { $lt: date } });
        return result.deletedCount;
    }
}

export const tokenRepository = new TokenRepository();
