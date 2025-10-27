import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Squadron from '@/models/Squadron';
import WebUser from '@/models/WebUser';
import FairRacingScore from '@/models/FairRacingScore';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req: NextRequest) {
  try {
    // Verificar autenticación
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    let userId: string;

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      userId = decoded.userId;
    } catch (error) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }

    await connectDB();

    // Verificar que el usuario existe
    const user = await WebUser.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Verificar que el usuario está en una escudería
    if (!user.squadron.squadronId) {
      return NextResponse.json(
        { error: 'No perteneces a ninguna escudería' },
        { status: 400 }
      );
    }

    // Buscar la escudería
    const squadron = await Squadron.findById(user.squadron.squadronId);
    if (!squadron) {
      return NextResponse.json(
        { error: 'Escudería no encontrada' },
        { status: 404 }
      );
    }

    const isCaptain = user.squadron.role === 'captain';

    // Si es capitán y hay más miembros, debe transferir capitanía primero
    if (isCaptain && squadron.members.length > 1) {
      return NextResponse.json(
        {
          error: 'Como capitán, debes transferir el liderazgo antes de salir',
          requiresTransfer: true,
          members: squadron.members.filter((m) => m.toString() !== userId),
        },
        { status: 400 }
      );
    }

    // Si es el único miembro (y capitán), eliminar la escudería
    if (squadron.members.length === 1) {
      await Squadron.findByIdAndDelete(squadron._id);

      // Actualizar usuario
      user.squadron.squadronId = undefined;
      user.squadron.role = 'none';
      user.squadron.joinedAt = undefined;
      await user.save();

      return NextResponse.json({
        success: true,
        message: 'Has salido de la escudería. La escudería fue eliminada por falta de miembros.',
        squadronDeleted: true,
      });
    }

    // Remover usuario de la escudería
    squadron.members = squadron.members.filter(
      (memberId) => memberId.toString() !== userId
    );

    // Recalcular promedio de fair racing
    const allMembersFairRacing = await FairRacingScore.find({
      pilotId: { $in: squadron.members },
    });

    const totalFairRacing = allMembersFairRacing.reduce(
      (sum, score) => sum + score.currentScore,
      0
    );
    squadron.fairRacingAverage = Math.round(totalFairRacing / squadron.members.length);

    // Si quedan menos de 2 miembros, marcar como inactiva
    if (squadron.members.length < 2) {
      squadron.isActive = false;
    }

    await squadron.save();

    // Actualizar usuario
    user.squadron.squadronId = undefined;
    user.squadron.role = 'none';
    user.squadron.joinedAt = undefined;
    await user.save();

    return NextResponse.json({
      success: true,
      message: `Has salido de ${squadron.name}`,
      squadronDeleted: false,
    });

  } catch (error: any) {
    console.error('Error leaving squadron:', error);
    return NextResponse.json(
      { error: 'Error al salir de la escudería', details: error.message },
      { status: 500 }
    );
  }
}
