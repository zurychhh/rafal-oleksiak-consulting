// =============================================================================
// MCC Campaigns API - CRUD + lifecycle management
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { campaignManager } from '@/lib/mcc/campaign/manager';
import { campaignOptimizer } from '@/lib/mcc/campaign/optimizer';
import type { CampaignStatus, Platform } from '@/lib/mcc/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/mcc/campaigns - List campaigns
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const filters: {
      status?: CampaignStatus[];
      platform?: Platform;
      search?: string;
    } = {};

    const statusParam = searchParams.get('status');
    if (statusParam) {
      filters.status = statusParam.split(',') as CampaignStatus[];
    }

    const platform = searchParams.get('platform') as Platform | null;
    if (platform) filters.platform = platform;

    const search = searchParams.get('search');
    if (search) filters.search = search;

    const campaigns = await campaignManager.listCampaigns(filters);

    return NextResponse.json({ campaigns });
  } catch (error) {
    console.error('MCC campaigns list error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to list campaigns' },
      { status: 500 },
    );
  }
}

// POST /api/mcc/campaigns - Create or perform action on campaign
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'create': {
        const campaign = await campaignManager.createCampaign({
          name: body.name,
          description: body.description || '',
          objective: body.objective,
          platforms: body.platforms,
          budget: body.budget,
          schedule: body.schedule,
          targeting: body.targeting,
          creatives: body.creatives || [],
          createdBy: body.createdBy || 'admin',
        });
        return NextResponse.json({ campaign }, { status: 201 });
      }

      case 'launch': {
        const campaign = await campaignManager.launchCampaign(body.campaignId);
        return NextResponse.json({ campaign });
      }

      case 'pause': {
        const campaign = await campaignManager.pauseCampaign(body.campaignId);
        return NextResponse.json({ campaign });
      }

      case 'resume': {
        const campaign = await campaignManager.resumeCampaign(body.campaignId);
        return NextResponse.json({ campaign });
      }

      case 'complete': {
        const campaign = await campaignManager.completeCampaign(body.campaignId);
        return NextResponse.json({ campaign });
      }

      case 'adjust_budget': {
        const campaign = await campaignManager.adjustBudget(
          body.campaignId,
          body.dailyBudget,
          body.allocation,
        );
        return NextResponse.json({ campaign });
      }

      case 'optimize': {
        const recommendations = await campaignOptimizer.analyzeCampaign(
          body.campaignId,
          body.period || {
            start: new Date(Date.now() - 7 * 86400_000).toISOString().split('T')[0],
            end: new Date().toISOString().split('T')[0],
            granularity: 'daily',
          },
        );
        return NextResponse.json({ recommendations });
      }

      case 'apply_recommendation': {
        await campaignOptimizer.applyRecommendation(body.recommendation);
        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error('MCC campaign action error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Campaign action failed' },
      { status: 500 },
    );
  }
}

// DELETE /api/mcc/campaigns?id=xxx
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Campaign ID required' }, { status: 400 });
    }

    await campaignManager.deleteCampaign(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('MCC campaign delete error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete campaign' },
      { status: 500 },
    );
  }
}
