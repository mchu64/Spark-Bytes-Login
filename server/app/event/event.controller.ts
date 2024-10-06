import { Request, Response } from 'express';
import prisma from '../prisma_client.ts';

export const get_events_for_user = async (req: Request, res: Response) => {
  const userId = req.body.user.id;
  try {
    const events = await prisma.event.findMany({
      where: {
        OR: [
          {
            createdById: userId,
          },
        ],
      },

      include: {
        tags: true,
        location: true,
        createdBy: {
          select: {
            name: true,
          },
        },
      },
    });
    return res.json(events);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const get_active_events = async (_: Request, res: Response) => {
  try {
    const now = new Date();
    const activeEvents = await prisma.event.findMany({
      where: {
        AND: [
          {
            exp_time: {
              gt: now,
            },
          },
          {
            done: false,
          },
        ],
      },
      include: {
        tags: true,
        location: true,
        photos: true,
        createdBy: {
          select: {
            name: true,
          },
        },
      },
    });
    return res.json({ events: activeEvents });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const get_event_by_id = async (req: Request, res: Response) => {
  // event_id: number
  const { event_id } = req.params;


  if (!event_id || isNaN(Number(event_id))) {  // Check if event_id exists and is a valid number
    return res.status(400).json({ error: 'Invalid event_id' });
  }
  try {
    const event = await prisma.event.findUnique({
      where: { event_id: Number(event_id) },
      include: {
        tags: true,
        location: true,
        photos: true,
        createdBy: {
          select: {
            name: true,
          },
        },
      },
    });
    if (event === null) {
      return res.status(404).json({ error: 'Event ID not found' });
    }
    return res.json(event);
  } catch (error) {
    console.error('Error retrieving event description:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const create_event = async (req: Request, res: Response) => {
  const { exp_time, description, qty, tags, photos, address, room, floor } = req.body;
  try {
    const userId = req.body.user.id;
    const now = new Date().toISOString();
    console.log('Value of tags:', tags);
    console.log(tags.connect);
    console.log(photos);
    const newEvent = await prisma.event.create({
      data: {
        post_time: now,
        exp_time,
        description,
        qty,
        done: false,

        tags: {
          connect: tags.connect, 
        },
        createdBy: {
          connect: { id: userId },
        },
        createdAt: now,
        updatedAt: now,
      },
    });

    if (address && room && floor) {
      await prisma.location.create({
        data: {
          Address: address,
          room: room,
          floor: parseInt(floor),
          event: {
            connect: { event_id: newEvent.event_id },
          },
        },
      });
    }

    if (photos && photos.length > 0) {
      const photoPromises = photos.map((photoBase64) => {
        return prisma.photo.create({
          data: {
            photo: photoBase64,
            event: {
              connect: { event_id: newEvent.event_id },
            },
          },
        });
      });

      await Promise.all(photoPromises);
    }

    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const edit_event = async (req: Request, res: Response) => {
  const { event_id } = req.params;
  const { exp_time, description, qty, location, photo, tag_ids } = req.body;

  try {
    const updatedEvent = await prisma.event.update({
      where: {
        event_id: Number(event_id),
      },
      data: {
        exp_time,
        description,
        qty,
        location: {
          update: {
            Address: location.Address,
            floor: location.floor,
            room: location.room,
            loc_note: location.loc_note,
          },
        },
        tags: {
          set: tag_ids.map((tag_id: number) => ({ tag_id })),
        },
      },
      include: {
        tags: true,
        location: true,
        photos: true,
      },
    });

    if (photo) {
      const newPhoto = await prisma.photo.create({
        data: {
          photo: photo,
          event: { connect: { event_id: updatedEvent.event_id } },
        },
      });
      updatedEvent.photos.push(newPhoto);
    }

    res.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
