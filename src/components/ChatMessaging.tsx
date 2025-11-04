import { useState } from 'react';
import { Send, Phone, Video, MoreVertical, Search, Paperclip, Smile, Check, CheckCheck, Image as ImageIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner@2.0.3';

interface Message {
  id: number;
  senderId: string;
  text: string;
  timestamp: string;
  read: boolean;
  type: 'text' | 'image';
  imageUrl?: string;
}

interface Contact {
  id: string;
  name: string;
  role: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  online: boolean;
}

export function ChatMessaging() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const contacts: Contact[] = [
    {
      id: '1',
      name: 'Royal Palace Banquet',
      role: 'Marriage Hall',
      avatar: 'https://images.unsplash.com/photo-1519167758481-83f29da8c740?w=100&h=100&fit=crop',
      lastMessage: 'We have December 15th available!',
      lastMessageTime: '2m ago',
      unread: 2,
      online: true,
    },
    {
      id: '2',
      name: 'Rahul Photography',
      role: 'Photographer',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      lastMessage: 'I can show you my portfolio tomorrow',
      lastMessageTime: '1h ago',
      unread: 0,
      online: true,
    },
    {
      id: '3',
      name: 'Spice Garden Catering',
      role: 'Caterer',
      avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=100&h=100&fit=crop',
      lastMessage: 'Menu options sent. Please review.',
      lastMessageTime: '3h ago',
      unread: 1,
      online: false,
    },
    {
      id: '4',
      name: 'Glam Studio',
      role: 'Makeup Artist',
      avatar: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=100&h=100&fit=crop',
      lastMessage: 'Trial session confirmed for Saturday',
      lastMessageTime: '1d ago',
      unread: 0,
      online: true,
    },
  ];

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      senderId: '1',
      text: 'Hello! Thank you for your interest in Royal Palace Banquet.',
      timestamp: '10:30 AM',
      read: true,
      type: 'text',
    },
    {
      id: 2,
      senderId: 'me',
      text: 'Hi! I am looking for a venue for December 15, 2025. Do you have availability?',
      timestamp: '10:32 AM',
      read: true,
      type: 'text',
    },
    {
      id: 3,
      senderId: '1',
      text: 'Yes, we have December 15th available! We can accommodate up to 500 guests.',
      timestamp: '10:33 AM',
      read: true,
      type: 'text',
    },
    {
      id: 4,
      senderId: '1',
      text: 'Here are some photos of our venue',
      timestamp: '10:34 AM',
      read: true,
      type: 'image',
      imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f29da8c740?w=800&h=600&fit=crop',
    },
    {
      id: 5,
      senderId: 'me',
      text: 'Looks beautiful! What are the package rates?',
      timestamp: '10:35 AM',
      read: false,
      type: 'text',
    },
  ]);

  const handleSendMessage = () => {
    if (!messageText.trim()) {
      toast.error('Please enter a message');
      return;
    }

    const newMessage: Message = {
      id: messages.length + 1,
      senderId: 'me',
      text: messageText,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      read: false,
      type: 'text',
    };

    setMessages([...messages, newMessage]);
    setMessageText('');
    toast.success('Message sent!');
  };

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen py-8 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="mb-4">Messages</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Connect with vendors instantly and get quick responses
          </p>
        </div>

        <Card className="glassmorphism h-[700px]">
          <CardContent className="p-0 h-full">
            <div className="grid md:grid-cols-3 h-full">
              {/* Contacts Sidebar */}
              <div className="border-r border-border">
                <div className="p-4 border-b border-border">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      className="pl-10"
                      placeholder="Search contacts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <ScrollArea className="h-[calc(700px-80px)]">
                  <div className="p-2">
                    {filteredContacts.map((contact) => (
                      <div
                        key={contact.id}
                        className={`p-4 rounded-lg cursor-pointer transition-all mb-2 ${
                          selectedContact?.id === contact.id
                            ? 'bg-secondary'
                            : 'hover:bg-secondary/50'
                        }`}
                        onClick={() => setSelectedContact(contact)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar>
                              <AvatarImage src={contact.avatar} />
                              <AvatarFallback>{contact.name[0]}</AvatarFallback>
                            </Avatar>
                            {contact.online && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="text-sm truncate">{contact.name}</h4>
                              <span className="text-xs text-muted-foreground">
                                {contact.lastMessageTime}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-muted-foreground truncate">
                                {contact.lastMessage}
                              </p>
                              {contact.unread > 0 && (
                                <Badge className="ml-2 bg-primary">{contact.unread}</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Chat Area */}
              <div className="md:col-span-2 flex flex-col">
                {selectedContact ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-4 border-b border-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar>
                              <AvatarImage src={selectedContact.avatar} />
                              <AvatarFallback>{selectedContact.name[0]}</AvatarFallback>
                            </Avatar>
                            {selectedContact.online && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                            )}
                          </div>
                          <div>
                            <h4 className="text-sm">{selectedContact.name}</h4>
                            <p className="text-xs text-muted-foreground">
                              {selectedContact.online ? 'Online' : 'Offline'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon">
                            <Phone className="w-5 h-5" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Video className="w-5 h-5" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Messages */}
                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${
                              message.senderId === 'me' ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            <div
                              className={`max-w-[70%] ${
                                message.senderId === 'me'
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-secondary'
                              } rounded-lg p-3`}
                            >
                              {message.type === 'image' && message.imageUrl && (
                                <img
                                  src={message.imageUrl}
                                  alt="Shared"
                                  className="rounded-lg mb-2 max-w-full"
                                />
                              )}
                              <p className="text-sm">{message.text}</p>
                              <div className="flex items-center justify-end gap-1 mt-1">
                                <span className="text-xs opacity-70">{message.timestamp}</span>
                                {message.senderId === 'me' && (
                                  <>
                                    {message.read ? (
                                      <CheckCheck className="w-3 h-3 opacity-70" />
                                    ) : (
                                      <Check className="w-3 h-3 opacity-70" />
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>

                    {/* Message Input */}
                    <div className="p-4 border-t border-border">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Paperclip className="w-5 h-5" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <ImageIcon className="w-5 h-5" />
                        </Button>
                        <Input
                          placeholder="Type a message..."
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleSendMessage();
                            }
                          }}
                          className="flex-1"
                        />
                        <Button variant="ghost" size="icon">
                          <Smile className="w-5 h-5" />
                        </Button>
                        <Button
                          className="gradient-maroon"
                          size="icon"
                          onClick={handleSendMessage}
                        >
                          <Send className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Send className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="mb-2">Select a conversation</h3>
                      <p className="text-muted-foreground">
                        Choose a vendor from the list to start chatting
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Tips */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <Card className="glassmorphism">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 gradient-pink rounded-full flex items-center justify-center mx-auto mb-3">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <h4 className="mb-2">Instant Responses</h4>
              <p className="text-sm text-muted-foreground">
                Get quick replies from verified vendors
              </p>
            </CardContent>
          </Card>

          <Card className="glassmorphism">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 gradient-gold rounded-full flex items-center justify-center mx-auto mb-3">
                <Video className="w-6 h-6 text-foreground" />
              </div>
              <h4 className="mb-2">Video Calls</h4>
              <p className="text-sm text-muted-foreground">
                Schedule video consultations with vendors
              </p>
            </CardContent>
          </Card>

          <Card className="glassmorphism">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 gradient-maroon rounded-full flex items-center justify-center mx-auto mb-3">
                <ImageIcon className="w-6 h-6 text-white" />
              </div>
              <h4 className="mb-2">Share Media</h4>
              <p className="text-sm text-muted-foreground">
                Exchange photos, videos, and documents
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
