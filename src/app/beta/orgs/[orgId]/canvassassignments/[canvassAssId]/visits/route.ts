import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import {
  CanvassAssignmentModel,
  PlaceVisitModel,
} from 'features/canvassAssignments/models';
import asCanvasserAuthorized from 'features/canvassAssignments/utils/asCanvasserAuthorized';

type RouteMeta = {
  params: {
    canvassAssId: string;
    orgId: string;
  };
};

export async function GET(request: NextRequest, { params }: RouteMeta) {
  const canvassAssId = params.canvassAssId;
  return asCanvasserAuthorized(
    {
      orgId: params.orgId,
      request: request,
    },
    async ({ orgId }) => {
      await mongoose.connect(process.env.MONGODB_URL || '');

      const assignmentModel = await CanvassAssignmentModel.find({
        _id: canvassAssId,
        orgId: orgId,
      });

      if (!assignmentModel) {
        return NextResponse.json({ error: {} }, { status: 404 });
      }

      const visitModels = await PlaceVisitModel.find({
        canvassAssId: canvassAssId,
      });

      return NextResponse.json({
        data: visitModels.map((model) => ({
          canvassAssId: model.canvassAssId,
          id: model._id.toString(),
          responses: model.responses,
          timestamp: model.timestamp,
        })),
      });
    }
  );
}

export async function POST(request: NextRequest, { params }: RouteMeta) {
  const canvassAssId = params.canvassAssId;
  return asCanvasserAuthorized(
    {
      orgId: params.orgId,
      request: request,
    },
    async ({ orgId }) => {
      await mongoose.connect(process.env.MONGODB_URL || '');

      const assignmentModel = await CanvassAssignmentModel.find({
        _id: canvassAssId,
        orgId: orgId,
      });

      if (!assignmentModel) {
        return NextResponse.json({ error: {} }, { status: 404 });
      }

      const payload = await request.json();

      const visit = new PlaceVisitModel({
        canvassAssId,
        responses: payload.responses,
        timestamp: new Date().toISOString(),
      });

      await visit.save();

      return NextResponse.json({
        data: {
          canvassAssId: visit.canvassAssId,
          id: visit._id.toString(),
          responses: visit.responses,
          timestamp: visit.timestamp,
        },
      });
    }
  );
}
