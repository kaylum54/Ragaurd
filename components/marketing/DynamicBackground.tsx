'use client';

import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

interface DataNode {
  id: number;
  x: number;
  y: number;
  pulseDelay: number;
}

export function DynamicBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [nodes, setNodes] = useState<DataNode[]>([]);

  useEffect(() => {
    // Generate floating particles
    const newParticles: Particle[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 10 + 15,
      delay: Math.random() * -20,
    }));
    setParticles(newParticles);

    // Generate network nodes
    const newNodes: DataNode[] = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: 10 + (i % 4) * 25 + Math.random() * 10,
      y: 20 + Math.floor(i / 4) * 40 + Math.random() * 20,
      pulseDelay: Math.random() * 2,
    }));
    setNodes(newNodes);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      {/* Base gradient - dark navy to deep blue */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#020817] via-[#0a1628] to-[#071126]" />

      {/* Animated gradient overlay */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background: 'linear-gradient(135deg, rgba(30,64,175,0.3) 0%, rgba(59,130,246,0.1) 25%, rgba(6,182,212,0.15) 50%, rgba(30,64,175,0.2) 75%, rgba(99,102,241,0.25) 100%)',
          backgroundSize: '400% 400%',
          animation: 'gradient-shift 15s ease infinite',
        }}
      />

      {/* Cyber grid */}
      <div
        className="absolute inset-0 animate-grid-pulse"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.07) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Scanning line effect */}
      <div
        className="absolute left-0 right-0 h-[2px] animate-scan"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.5), rgba(6,182,212,0.8), rgba(59,130,246,0.5), transparent)',
          boxShadow: '0 0 20px rgba(6,182,212,0.5), 0 0 40px rgba(59,130,246,0.3)',
        }}
      />

      {/* Floating particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: `radial-gradient(circle, rgba(59,130,246,0.8) 0%, rgba(59,130,246,0) 70%)`,
            animation: `float ${particle.duration}s ease-in-out infinite`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}

      {/* Glowing orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full animate-pulse-glow"
        style={{
          background: 'radial-gradient(circle, rgba(30,64,175,0.3) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      <div
        className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full animate-pulse-glow"
        style={{
          background: 'radial-gradient(circle, rgba(6,182,212,0.25) 0%, transparent 70%)',
          filter: 'blur(50px)',
          animationDelay: '-2s',
        }}
      />
      <div
        className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full animate-pulse-glow"
        style={{
          background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)',
          filter: 'blur(40px)',
          animationDelay: '-4s',
        }}
      />

      {/* Network nodes with connections */}
      <svg className="absolute inset-0 w-full h-full opacity-30">
        {/* Connection lines between nodes */}
        {nodes.map((node, i) =>
          nodes.slice(i + 1).map((otherNode, j) => {
            const distance = Math.sqrt(
              Math.pow(node.x - otherNode.x, 2) + Math.pow(node.y - otherNode.y, 2)
            );
            if (distance < 35) {
              return (
                <line
                  key={`${node.id}-${otherNode.id}`}
                  x1={`${node.x}%`}
                  y1={`${node.y}%`}
                  x2={`${otherNode.x}%`}
                  y2={`${otherNode.y}%`}
                  stroke="url(#lineGradient)"
                  strokeWidth="1"
                  opacity={0.5}
                />
              );
            }
            return null;
          })
        )}
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(59,130,246,0.5)" />
            <stop offset="100%" stopColor="rgba(6,182,212,0.5)" />
          </linearGradient>
        </defs>
      </svg>

      {/* Pulsing network nodes */}
      {nodes.map((node) => (
        <div
          key={node.id}
          className="absolute w-2 h-2 rounded-full animate-node-pulse"
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
            animationDelay: `${node.pulseDelay}s`,
          }}
        />
      ))}

      {/* Hexagonal pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5L55 20v25L30 55 5 45V20z' stroke='%233b82f6' stroke-width='1' fill='none'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#020817] to-transparent" />
    </div>
  );
}
